using Microsoft.Html.Core.Tree.Nodes;

namespace MarkSite.Core
{
	static class Extensions
	{
		public static string AttrValue(this ElementNode element, string attributeName, string defaultValue = null)
		{
			AttributeNode attr = element.GetAttribute(attributeName);

			if (attr == null)
			{
				return defaultValue;
			}

			return attr.Value;
		}
	}
}
