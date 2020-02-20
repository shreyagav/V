using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace Services.Helpers
{
    public class Converters
    {
        public static string IntTimeToStr(int val)
        {
            string am = val < 1200 ? "AM" : "PM";
            string hours = (val < 1200 ? val / 100 : (val / 100) - 12).ToString().PadLeft(2, '0');
            if (hours == "00" && val >= 1200 && val<1300)
            {
                hours = "12";
                am = "PM";
            }
            string minutes = (val % 100).ToString().PadLeft(2, '0');
            return $"{hours}:{minutes} {am}";
        }
    }

    public static class TypeExt
    {
        public static List<FieldInfo> GetFieldsForHierarchy(this Type t, BindingFlags flags)
        {
            var res = new List<FieldInfo>();
            var type = t;
            while (type != null)
            {
                res.AddRange(type.GetFields(flags));
                type = type.BaseType;
            }

            return res;
        }

        public static List<PropertyInfo> GetPropsForHierarchy(this Type t, BindingFlags flags = BindingFlags.Public | BindingFlags.Instance)
        {
            var res = new List<PropertyInfo>();
            var type = t;
            while (type != null)
            {
                res.AddRange(type.GetProperties(flags).Where(p => res.Any(r => r.Name == p.Name) == false));//add only uniq props
                type = type.BaseType;
            }

            return res;
        }
    }

    public class ObjectConverter<TFrom, TTo>
    {
        private class ShortPropertyInfo
        {
            public string Name { get; set; }
            public Type Type { get; set; }
        }

        private Type _typeFrom;
        private Type _typeTo;
        private List<ShortPropertyInfo> _propertyList;
        private ParameterExpression _expressionParamFrom = null;
        private ParameterExpression _expressionParamTo = null;
        private readonly List<Expression> _exprList = new List<Expression>();
        private List<Tuple<ShortPropertyInfo, ShortPropertyInfo>> _customMappingList;
        private List<Tuple<object, ShortPropertyInfo>> _customValueMappingList;
        private List<Tuple<Expression, ShortPropertyInfo>> _customExpressionList = new List<Tuple<Expression, ShortPropertyInfo>>();
        private Func<TFrom, TTo> _convertFunc;
        private bool _bRecompile = true;
        private readonly object _lockObject = new object();

        private ObjectConverter()
        {
        }


        public static ObjectConverter<TFrom, TTo> Create()
        {
            return new ObjectConverter<TFrom, TTo>();
        }

        public ObjectConverter<TFrom, TTo> AddCustomMapping<U2>(object o, Expression<Func<TTo, U2>> to)
        {
            if (o == null || to == null) return this;

            MemberExpression memberTo = to.Body as MemberExpression;

            if (memberTo == null)
                throw new ArgumentException("Expression To is not a Field/Property");

            _bRecompile = true;

            if (_customValueMappingList == null) _customValueMappingList = new List<Tuple<object, ShortPropertyInfo>>();

            ShortPropertyInfo propOrFieldTo = fieldInfo<TTo, U2>(memberTo) ?? propertyInfo<TTo, U2>(memberTo);
            _customValueMappingList.Add(new Tuple<object, ShortPropertyInfo>(o, propOrFieldTo));

            return this;
        }

        public ObjectConverter<TFrom, TTo> AddCustomMapping<U1, U2>(Expression<Func<TFrom, U1>> from, Expression<Func<TTo, U2>> to)
        {
            if (from == null || to == null) return this;

            MemberExpression memberFrom = from.Body as MemberExpression;
            MemberExpression memberTo = to.Body as MemberExpression;
            LambdaExpression b = from as LambdaExpression;

            if ((memberFrom == null && b == null) || memberTo == null)
            {
                throw new ArgumentException("Expression is not a Field/Property");
            }

            _bRecompile = true;

            if (_customMappingList == null) _customMappingList = new List<Tuple<ShortPropertyInfo, ShortPropertyInfo>>();

            ShortPropertyInfo propOrFieldTo = fieldInfo<TTo, U2>(memberTo) ?? propertyInfo<TTo, U2>(memberTo);

            ShortPropertyInfo propOrFieldFrom = fieldInfo<TFrom, U1>(memberFrom) ?? propertyInfo<TFrom, U1>(memberFrom);

            if (b != null)
            {
                _customExpressionList.Add(new Tuple<Expression, ShortPropertyInfo>(b, propOrFieldTo));
            }
            else
                _customMappingList.Add(new Tuple<ShortPropertyInfo, ShortPropertyInfo>(propOrFieldFrom, propOrFieldTo));

            return this;
        }


        public TTo Map(TFrom item)
        {
            if (!_bRecompile) return _convertFunc(item);

            lock (_lockObject)
            {
                _exprList.Clear();
                _convertFunc = createMap();
                _bRecompile = false;
            }

            return _convertFunc(item);
        }

        public IEnumerable<TTo> Map(IEnumerable<TFrom> item)
        {
            if (_convertFunc == null) _convertFunc = createMap();
            return item.Select(c => _convertFunc(c));
        }


        private Func<TFrom, TTo> createMap()
        {
            _typeFrom = typeof(TFrom);
            _expressionParamFrom = Expression.Parameter(_typeFrom, "inp");
            _propertyList =
                _typeFrom.GetPropsForHierarchy(BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public)
                    .Where(c => c.CanRead)
                    .Select(t => new ShortPropertyInfo { Name = t.Name, Type = t.PropertyType })
                    .Union(_typeFrom.GetFieldsForHierarchy(BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public)
                        .Where(c => c.IsAssembly || c.IsPublic)
                        .Select(t => new ShortPropertyInfo { Name = t.Name, Type = t.FieldType })).ToList();

            _typeTo = typeof(TTo);
            _expressionParamTo = Expression.Parameter(_typeTo, "ret");

            _exprList.Add(Expression.Assign(_expressionParamTo, Expression.New(_typeTo)));

            var tOutList = _typeTo.GetPropsForHierarchy(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic).Where(t => t.CanWrite).Select(t => new ShortPropertyInfo { Name = t.Name, Type = t.PropertyType })
                .Union(_typeTo.GetFieldsForHierarchy(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic).Select(t => new ShortPropertyInfo { Name = t.Name, Type = t.FieldType })).ToList();

            foreach (var oEntry in tOutList)
            {
                if (!_propertyList.Exists(t => String.Compare(t.Name, oEntry.Name, true) == 0 &&
                    (t.Type == oEntry.Type || t.Type == Nullable.GetUnderlyingType(oEntry.Type))))
                    continue;

                if (_customExpressionList.Exists(c => c.Item2.Name == oEntry.Name)) continue;

                _exprList.Add(Expression.Assign(Expression.PropertyOrField(_expressionParamTo, oEntry.Name),
                    Expression.Convert(Expression.PropertyOrField(_expressionParamFrom, oEntry.Name), oEntry.Type)));
            }

            if (_customMappingList != null)
                foreach (var customMap in _customMappingList)
                {
                    _exprList.Add(Expression.Assign(
                        Expression.PropertyOrField(_expressionParamTo, customMap.Item2.Name),
                        Expression.Convert(Expression.PropertyOrField(_expressionParamFrom, customMap.Item1.Name), customMap.Item2.Type)));
                }

            if (_customValueMappingList != null)
                foreach (var valueMap in _customValueMappingList)
                {
                    _exprList.Add(Expression.Assign(
                        Expression.PropertyOrField(_expressionParamTo, valueMap.Item2.Name),
                        Expression.Convert(Expression.Constant(valueMap.Item1), valueMap.Item2.Type)));
                }


            _exprList.Add(_expressionParamTo);
            var lambda = Expression.Lambda<Func<TFrom, TTo>>(Expression.Block(new[] { _expressionParamTo }, _exprList), _expressionParamFrom);
            return (Func<TFrom, TTo>)lambda.Compile();
        }

        private ShortPropertyInfo fieldInfo<T, U>(MemberExpression member)
        {
            FieldInfo fi = member?.Member as FieldInfo;
            if (fi == null) return null;
            return new ShortPropertyInfo { Name = fi.Name, Type = fi.FieldType };
        }

        private ShortPropertyInfo propertyInfo<T, U>(MemberExpression member)
        {
            PropertyInfo piInfo = member?.Member as PropertyInfo;
            if (piInfo == null) return null;
            return new ShortPropertyInfo { Name = piInfo.Name, Type = piInfo.PropertyType };
        }
    }
}
