using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace Web
{
    public class Helper
    {
        public Func<T, bool> GetQuery<T>(dynamic obj)
        {
            Expression<Func<T, bool>> lambda = null;
            var paramType = typeof(T);
            var parameter = Expression.Parameter(paramType, "a");
            foreach (PropertyDescriptor prop in TypeDescriptor.GetProperties(obj))
            {
                var propertyExp = Expression.Property(parameter, prop.Name);
                MethodInfo method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                var someValue = Expression.Constant(prop.GetValue(obj), typeof(string));
                var containsMethodExp = Expression.Call(propertyExp, method, someValue);
                var temp = Expression.Lambda<Func<T, bool>>(containsMethodExp, parameter);
                if (lambda == null)
                {
                    lambda = temp;
                }
                else
                {
                    lambda = Expression.And(lambda, temp);
                }
            }
            return lambda.Compile();
        }


    }
}
