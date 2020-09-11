# Vue function API Document #

---

function initVueList(options)

options:
el				String  (required) element selector
apiConfig		Object  (required) API config
viewPageUrl     String  url for view item detail
data			Object  extra data
methods			Object  extra methods
loadFirstPage	Boolean is auto load first page, default true
mounted			Function	callback after mounted
updated			Function	callback after data updated
size			Number		page size, data limit per page
pageParam		String		page param name, default "page"
sizeParam		String		size param name, default "size"
filterColumns	Object		filter columns, it will as data for Ajax request
checkingColumns	Object		It can check some column name for data
afterLoadData	Function	callback after load data
afterUpdateList Function	callback after update list
onLoadError		Function	callback after load error

data:
initOptions  page  size  count  pageCount  keywords  filters  list  ajaxLock  status  checkingColumns

methods:
getItemById  cleanList  checkColumns  loadPage  loadFirstPage  loadPrevPage  loadNextPage

event:
onPageNumClick
onPageNumChange
onQuery
onView
onRemove
formatDate
formatDateTime
fromNowExpress

