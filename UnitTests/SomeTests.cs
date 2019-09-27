using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace UnitTests
{
    public class TestEntity
    {
        public string Name { get; set; }
        public string Chapter { get; set; }
        public DateTime Date { get; set; }
    }
    [TestClass]
    public class SomeTests
    {
        public Func<T, bool> GetQuery<T>(dynamic obj)
        {
            Expression lambda = null;
            var paramType = typeof(T);
            var parameter = Expression.Parameter(paramType, "a");
            foreach (PropertyDescriptor prop in TypeDescriptor.GetProperties(obj))
            {

                var propertyExp = Expression.Property(parameter, prop.Name);
                var notNull = Expression.NotEqual(propertyExp, Expression.Constant(null));
                MethodInfo method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                var someValue = Expression.Constant(prop.GetValue(obj), typeof(string));
                var containsMethodExp = Expression.Call(Expression.Call(propertyExp, typeof(string).GetMethod("ToString", Type.EmptyTypes)), method, someValue);
                var temp = Expression.AndAlso(notNull, containsMethodExp);
                if (lambda == null)
                {
                    lambda = temp;
                }
                else
                {
                    lambda = Expression.AndAlso(lambda, temp);
                }
            }
            return Expression.Lambda<Func<T, bool>>(lambda, parameter).Compile();
        }
        [TestMethod]
        public void TestGetExpression()
        {
            var testArray = new TestEntity[] { new TestEntity() { Chapter = "aaaa", Name = "1111" }, new TestEntity() { Chapter = "bbbb", Name = "2222", Date = DateTime.Now } };

            var temp = new { Name = "11", Date = "2019" };
            var exp = GetQuery<TestEntity>(temp);
            var res = testArray.Where(exp);
        }
    }
}
