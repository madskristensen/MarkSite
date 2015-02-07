using System;
using System.Collections.Generic;

namespace MarkSite.Core
{
	public class MarkdownPage
	{
		public MarkdownPage()
		{
			Children = new List<MarkdownPage>();
		}

		public string Title { get; set; }
		public string Description { get; set; }
		public string Keywords { get; set; }
		public string Slug { get; set; }
		public string Content { get; set; }
		public DateTime DateModified { get; set; }
		public MarkdownPage Parent { get; set; }
		public List<MarkdownPage> Children { get; private set; }

		public override string ToString()
		{
			return Title;
		}
	}
}
