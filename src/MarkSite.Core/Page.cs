using System;

namespace MarkSite.Core
{
	public class Page
    {
		public string Title { get; set; }
		public string Description { get; set; }
		public string Content { get; set; }
		public DateTime DateModified { get; set; }
	}
}
