using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Html.Core.Tree.Nodes;

namespace MarkSite.Core
{
	static class Extensions
	{
		public static string AttrValue(this ElementNode element, string attributeName, string fileName)
		{
			AttributeNode attr = element.GetAttribute(attributeName);

			if (attr == null)
			{
				string error = string.Format("You must specify the '{0}' property in {1}", attributeName, fileName);
				throw new ArgumentNullException(error);
			}

			return attr.Value;
		}
	}
}
