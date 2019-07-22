using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace Services
{
    public delegate int RenderExcelPart(ExcelWorksheet ws, int rowNumber);

    public class ExcelService
    {
        public static byte[] GetExcel<T>(T[] array, Dictionary<string,string> columnNames = null, RenderExcelPart headerRendered = null, RenderExcelPart footerRender = null )
        {
            byte[] fileContents = null;

            if(columnNames == null || columnNames.Count == 0)
            {
                columnNames = GetColumnNames<T>(array[0]);
            }
            using (var package = new ExcelPackage())
            {
                ExcelWorksheet ws = package.Workbook.Worksheets.Add("Data");
                int rowCount = 1;
                if (headerRendered != null)
                {
                    rowCount += headerRendered(ws, rowCount);
                }
                int count = 1;
                foreach (var pair in columnNames)
                {
                    ws.Cells[rowCount, count].Value = pair.Value;
                    ws.Cells[rowCount, count].Style.Font.Size = 12;
                    ws.Cells[rowCount, count].Style.Font.Bold = true;
                    ws.Cells[rowCount, count].Style.Border.Top.Style = ExcelBorderStyle.Hair;
                    count++;
                }
                rowCount++;
                foreach (T item in array)
                {
                    count = 1;
                    foreach (var pair in columnNames)
                    {
                        ws.Cells[rowCount, count].Value = GetPropertyValue(item, pair.Key).ToString();
                        ws.Cells[rowCount, count].Style.Border.Top.Style = ExcelBorderStyle.Hair;
                        count++;
                    }
                    rowCount++;
                }
                if (footerRender != null)
                {
                    footerRender(ws, rowCount);
                }
                fileContents = package.GetAsByteArray();
            }

            return fileContents;
        }

        private static object GetPropertyValue(object obj, string propertyName)
        {
            return obj.GetType().GetProperty(propertyName).GetValue(obj);
        }

        private static Dictionary<string,string> GetColumnNames<T>(T obj)
        {
            var props = obj.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);
            var res = new Dictionary<string, string>();
            foreach(var p in props)
            {
                res.Add(p.Name, p.Name);
            }
            return res;
        }
    }
}
