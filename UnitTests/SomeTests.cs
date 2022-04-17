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

    public class TestItem
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
    }
    [TestClass]
    public class SomeTests
    {
        //[TestMethod]
        //public void GroupingTest()
        //{
        //    var list = new List<TestItem>()
        //    {
        //        new TestItem(){ Id = 1, Amount=100, Description = "goods1"},
        //        new TestItem(){ Id = 1, Amount=6, Description = "tax1"},
        //        new TestItem(){ Id = 1, Amount=8, Description = "tax2"},
        //        new TestItem(){ Id = 2, Amount=300, Description = "goods2"},
        //        new TestItem(){ Id = 2, Amount=13, Description = "tax1"},
        //        new TestItem(){ Id = 2, Amount=34, Description = "tax2"},
        //        new TestItem(){ Id = 3, Amount=-400, Description = "return1"},
        //        new TestItem(){ Id = 3, Amount=-13, Description = "tax1"},
        //        new TestItem(){ Id = 3, Amount=-34, Description = "tax2"},
        //    };
        //    var grouped = list.GroupBy(c => c.Id);
        //    var temp = list.Max(a => Math.Abs(a.Amount));
        //    var res = grouped.Select(c => new
        //    {
        //        Id = c.Key,
        //        Amount = c.Sum(a=>a.Amount),
        //        Description = c.Where(b=>Math.Abs(b.Amount) == c.Max(a=>Math.Abs(a.Amount))).Select(b=>b.Description).First()
        //    });

        //}

        //public Func<T, bool> GetQuery<T>(dynamic obj)
        //{
        //    Expression lambda = null;
        //    var paramType = typeof(T);
        //    var parameter = Expression.Parameter(paramType, "a");
        //    foreach (PropertyDescriptor prop in TypeDescriptor.GetProperties(obj))
        //    {

        //        var propertyExp = Expression.Property(parameter, prop.Name);
        //        var notNull = Expression.NotEqual(propertyExp, Expression.Constant(null));
        //        MethodInfo method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
        //        var someValue = Expression.Constant(prop.GetValue(obj), typeof(string));
        //        var containsMethodExp = Expression.Call(Expression.Call(propertyExp, typeof(string).GetMethod("ToString", Type.EmptyTypes)), method, someValue);
        //        var temp = Expression.AndAlso(notNull, containsMethodExp);
        //        if (lambda == null)
        //        {
        //            lambda = temp;
        //        }
        //        else
        //        {
        //            lambda = Expression.AndAlso(lambda, temp);
        //        }
        //    }
        //    return Expression.Lambda<Func<T, bool>>(lambda, parameter).Compile();
        //}
        //[TestMethod]
        //public void TestGetExpression()
        //{
        //    var testArray = new TestEntity[] { new TestEntity() { Chapter = "aaaa", Name = "1111" }, new TestEntity() { Chapter = "bbbb", Name = "2222", Date = DateTime.Now } };

        //    var temp = new { Name = "11", Date = "2019" };
        //    var exp = GetQuery<TestEntity>(temp);
        //    var res = testArray.Where(exp);
        //}
    }
}
