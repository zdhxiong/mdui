interface IBasicObject {
	[key: string]: IBasicObject | string | number | Array<IBasicObject> | boolean | undefined | null
}
type Dom = HTMLElement | Document
type Selector<U extends Dom> = Document | string | mdui.IjQuery<U> | U | U[] | NodeList | NodeListOf<U>

// 核心
interface jQueryCallable {
	/** 可以传入 CSS 选择器、 HTML 字符串 DOM 元素、DOM 元素数组、NodeList、JQ 对象，返回包含指定元素的 JQ 对象。 */
	<T extends Dom>(selector: Selector<T>): mdui.IjQuery<T>
	(selector: Document): mdui.IjQuery<Document>

	/** 可以传入一个函数，在 DOM 加载完毕后会调用该函数。 */
	(onLoad: Function): void
}

// 拓展相关
interface jQueryExtendFunctions {
	/** 只传入一个对象，该对象中的属性将合并到 JQ 对象中，相当于在 JQ 的命名空间下添加新的功能。 */
	extend<T>(customFuncs: T): (mdui.jQueryStatic & T)
	/** 传入了两个或更多个对象，所有对象的属性都添加到第一个对象，并返回合并后的对象。 */
	extend<T, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
		target: T,
		obj1: T1,
		obj2?: T2,
		obj3?: T3,
		obj4?: T4,
		obj5?: T5,
		obj6?: T6,
		obj7?: T7,
		obj8?: T8,
		obj9?: T9,
		obj10?: T10
	): T & T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10;
	/** 泛型太多了，建议用两个 extend 以获得类型推断 */
	extend<T, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
		target: T,
		obj1: T1,
		obj2?: T2,
		obj3?: T3,
		obj4?: T4,
		obj5?: T5,
		obj6?: T6,
		obj7?: T7,
		obj8?: T8,
		obj9?: T9,
		obj10?: T10,
		...objs: any[]
	): T & T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & { [key: string]: any };
	/** jQuery 的原型链 */
	fn: mdui.IjQuery<HTMLElement>
}

// URL
interface jQueryURLOperations {
	/** 将数组或对象序列化。 */
	pararm(x: Array<any> | IBasicObject): string
}

// 数组对象操作
interface jQueryObjectsOperations {
	/** 遍历数组 */
	each<T>(x: Array<T>, iterator: (i: number, value: T) => void)
	/** 遍历对象 */
	each(x: Object, iterator: (i: number, value: any) => void)

	/** 合并两个数组，合并的结果会替换第一个数组的内容，并返回合并的结果。 */
	merge<T, U>(a: Array<T>, b: Array<U>): Array<T & U>

	/** 删除数组中的重复元素。可以是 DOM 元素数组、字符串数组、数字数组。返回去重后的数组。 */
	unique<T>(a: Array<T>): Array<T>

	/** 遍历数组或对象，通过函数返回一个新的数组或对象，null 和 undefined 将被过滤掉。 */
	map<T, U>(x: Array<T>, iterator: (value: T, index: number) => U): Array<U>
	map(x: Object, iterator: (value: any, index: number) => any): any

	/** 判断父节点是否包含子节点。 */
	contains(father: HTMLElement | Document, child: HTMLElement | Document): boolean
}

// 核心
interface IjQueryCore<T extends Dom> {
	[key: number]: T
	/** 返回 JQ 对象中元素的数量。 */
	readonly length: number
	/** 在 JQ 的原型链上扩展方法。 */
	extend<T>(customFuncs: T): (mdui.IjQuery<HTMLElement> & T)
}
// 对象访问
interface IjQueryOperations<T extends Dom> {
	/** 根据 CSS 选择器、DOM 元素、或 JQ 对象来检测匹配的元素集合，至少有一个元素匹配则返回 true。 */
	is(selector: Selector<any>): boolean
	/** 遍历一个 JQ 对象，为每一个匹配元素执行一个函数。如果函数返回 false，则结束遍历。 */
	each(func: (this: T, index: number, elem: T) => boolean | void): mdui.IjQuery<T>
	/** 遍历一个 JQ 对象，为对象的每个元素都调用一个函数，生成一个包含函数返回值的新的 JQ 对象。null 和 undefined 会被过滤掉。 */
	map<U extends Dom>(iterator: (value: T, index: number) => U | null | undefined): mdui.IjQuery<U>
	/** 返回 JQ 对象中指定索引号的元素的 JQ 对象。 */
	eq(i: number): mdui.IjQuery<T>
	/** 返回 JQ 对象中第一个元素的 JQ 对象。 */
	first(): T
	/** 返回 JQ 对象中最后一个元素的 JQ 对象。 */
	last(): T
	/** 返回 JQ 对象中指定索引号的 DOM 元素。若没有指定索引号，则返回 JQ 对象中所有 DOM 元素组成的数组。 */
	get(i?: number): T
	/** 返回 JQ 对象中第一个元素相对于同辈元素的索引值。 */
	index(): number
	/** 返回 JQ 对象中第一个元素相对与 CSS 选择器匹配元素的索引值。 */
	index(selector: string): number
	/** 返回该 DOM 元素在 JQ 对象中的索引值。 */
	index(dom: HTMLElement): T
	/** 返回一个 JQ 对象的子集。 */
	slice(start: number, end?: number): mdui.IjQuery<T>
	/** 从 JQ 对象中筛选出与指定表达式匹配的元素的 JQ 对象。 */
	filter(selector: Selector<T>): mdui.IjQuery<T>
	/** 从 JQ 对象中筛选出与过滤器匹配的元素的 JQ 对象。 */
	filter(func: (this: T, index: number, elem: T) => boolean): mdui.IjQuery<T>
	/** 从 JQ 对象中筛选出与指定表达式不匹配的元素的 JQ 对象。 */
	not(selector: Selector<T>): mdui.IjQuery<T>
	/** 从 JQ 对象中筛选出与过滤器不匹配的元素的 JQ 对象。 */
	not(func: (this: T, index: number, elem: T) => boolean): mdui.IjQuery<T>
}

// CSS
interface IjQueryCSS<T extends Dom> {
	/** 元素上的 CSS 类，有则删除，无则添加。多个类名之间可以用空格分隔。 */
	toggleClass(className: string): mdui.IjQuery<T>
	/** 移除元素上的 CSS 类，多个类名之间可以用空格分隔。 */
	removeClass(className: string): mdui.IjQuery<T>
	/** 为元素添加 CSS 类，多个类名之间可以用空格分隔。 */
	addClass(className: string): mdui.IjQuery<T>
	/** 判断 JQ 对象中的第一个元素是否含有指定 CSS 类。 */
	hasClass(className: string): mdui.IjQuery<T>
}

// 节点属性
interface IjQueryAttrs<T extends Dom> {
	/** 获取选中元素的属性值。 */
	prop(attr: string): string
	/** 设置选中元素的属性值。 */
	prop(attr: string, val: any): mdui.IjQuery<T>
	/** 设置选中元素的属性值。 */
	prop(attrs: { [key: string]: any }): mdui.IjQuery<T>

	/** 删除选中元素指定的属性值。 */
	removeProp(attr: string): mdui.IjQuery<T>

	/** 获取第一个元素的属性值。 */
	attr(attr: string): string
	/** 设置所有选中元素的属性值。 */
	attr(attr: string, val: any): mdui.IjQuery<T>
	/** 同时设置元素的多个属性值。 */
	attr(attrs: { [key: string]: any }): mdui.IjQuery<T>

	/** 删除选中元素的指定属性值。 */
	removeAttr(attr: string): mdui.IjQuery<T>

	/** 获取选中的第一个元素的值。 */
	val(): string
	/** 设置选中元素的值。 */
	val(value: string): mdui.IjQuery<T>

	/** 获取选中的第一个元素的文本内容。 */
	text(): string
	/** 设置选中元素的文本内容。 */
	text(value: string): mdui.IjQuery<T>

	/** 获取选中的第一个元素的 HTML 内容。 */
	html(): string
	/** 设置选中元素的 HTML。 */
	html(value: string): mdui.IjQuery<T>
}

// 数据存储
interface IjQueryDataStore<T extends Dom> {
	/** 在 DOM 元素上存储一个字符串。 */
	data(key: string, value: string | Object): void
	/** 在 DOM 上同时存储多个数据 */
	data(datas: { [key: string]: string | Object }): void
	/** 获取 DOM 上存储的所有数据 */
	data(): { [key: string]: string | Object }

	/** 删除 DOM 上存储的数据。 */
	removeData(key: string): void
}
interface jQueryDataStore {
	/** 在 DOM 元素上存储一个字符串。 */
	data(dom: HTMLElement, key: string, value: string | Object): void
	/** 在 DOM 上同时存储多个数据 */
	data(dom: HTMLElement, datas: { [key: string]: string | Object }): void
	/** 获取 DOM 上存储的所有数据 */
	data(dom: HTMLElement): { [key: string]: string | Object }

	/** 删除 DOM 上存储的数据。 */
	removeData(dom: HTMLElement, key: string): void
}

// 样式
interface IjQueryStyle<T extends Dom> {
	/** 获取 JQ 对象中的第一个元素的样式值。 */
	css(style: string): string
	/** 设置每一个元素的样式。 */
	css(style: string, value: string | number): mdui.IjQuery<T>
	/** 设置每一个元素的样式。 */
	css(styles: { [key: string]: string | number }): mdui.IjQuery<T>

	/** 则获取 JQ 对象中第一个元素的宽度。 */
	width(): number
	/** 设置 JQ 对象中所有元素的宽度，如果参数是个数字或数字字符串，会自动添加 px 作为单位。该方法获取的值默认不包含内边距和外边距，当 box-sizing:border-box 时，会包含内边距。 */
	width(val: string | number): mdui.IjQuery<T>

	/** 则获取 JQ 对象中第一个元素的高度。 */
	height(): number
	/** 设置 JQ 对象中所有元素的高度，如果参数是个数字或数字字符串，会自动添加 px 作为单位。该方法获取的值默认不包含内边距和外边距，当 box-sizing:border-box 时，会包含内边距。 */
	height(val: string | number): mdui.IjQuery<T>

	/** 获取元素的宽度，包含内边距。 */
	innerWidth(): number

	/** 获取元素的高度，包含内边距。 */
	innerHeight(): number

	/** 隐藏 JQ 对象中的所有元素。 */
	hide(): mdui.IjQuery<T>

	/** 恢复 JQ 对象中的所有元素的显示状态。 */
	show(): mdui.IjQuery<T>

	/** 切换 JQ 对象中所有元素的显示状态。 */
	toggle(): mdui.IjQuery<T>

	/** 获取元素相对于 document 的偏移，以及元素的宽度和高度。 */
	offset(): { top: number, left: number, width: number, height: number }

	/** 返回 JQ 对象中第一个元素的用于定位的父元素的 JQ 对象。即父元素中第一个 position 为 relative 或 absolute 的元素。 */
	offsetParent(): T

	/** 获取元素相对于父元素的偏移，以及宽度和高度。 */
	position(): { top: number, left: number, width: number, height: number }
}

// 查找结点
interface IjQueryQuery<T extends Dom> {
	/** 根据 CSS 选择器找到指定的后代节点的集合。 */
	find(selector: string): mdui.IjQuery<T>

	/** 获取匹配元素的直接子元素， */
	children<U extends Dom>(selector?: Selector<U>): mdui.IjQuery<U>

	/** 对匹配元素的子元素，按传入的参数进行过滤，返回过滤后的元素的 JQ 对象。 */
	has<U extends Dom>(selector: Selector<U>): mdui.IjQuery<U>

	/** 返回匹配的直接父元素的 JQ 对象。 */
	parent<U extends Dom>(selector?: Selector<U>): mdui.IjQuery<U>

	/** 返回匹配的所有祖先元素的 JQ 对象。 */
	parents<U extends Dom>(selector?: Selector<U>): mdui.IjQuery<U>

	/** 查找当前元素的所有父辈元素，直到遇到匹配的那个元素为止。返回的 JQ 对象里包含了下面所有找到的父辈元素，但不包含参数匹配到的元素。 */
	parentsUntil(selector: Selector<any>): mdui.IjQuery<any>

	/** 获取当前元素的前一个同辈元素的 JQ 对象。 */
	prev<U extends Dom>(selector?: Selector<U>): mdui.IjQuery<U>

	/** 获取当前元素前面的所有同辈元素的 JQ 对象。 */
	prevAll<U extends Dom>(selector?: Selector<U>): mdui.IjQuery<U>

	/** 获取当前元素前面所有的同辈元素，直到遇到匹配元素，不包含匹配元素。 */
	prevUntil(selector?: Selector<any>): mdui.IjQuery<any>

	/** 获取当前元素的后一个同辈元素的 JQ 对象。 */
	next<U extends Dom>(selector?: Selector<U>): mdui.IjQuery<U>

	/** 获取当前元素后面的所有同辈元素的 JQ 对象。 */
	nextAll<U extends Dom>(selector?: Selector<U>): mdui.IjQuery<U>

	/** 获取当前元素后面所有的同辈元素，直到遇到匹配元素，不包含匹配元素。 */
	nextUntil(selector?: Selector<any>): mdui.IjQuery<any>

	/** 从当前元素向上逐级匹配，返回最先匹配到的元素。 */
	closest<U extends Dom>(selector: Selector<U>): mdui.IjQuery<U>

	/** 获取当前元素的所有同辈元素。 */
	siblings(selector?: Selector<any>): mdui.IjQuery<any>

	/** 添加元素到当前 JQ 对象中。 */
	add(selector: Selector<any>): mdui.IjQuery<T>
}

// 节点操作
interface IjQueryNodeOperation<T extends Dom> {
	/** 从 DOM 中移除选中元素的所有子节点。 */
	empty(): mdui.IjQuery<T>

	/** 从 DOM 中移除所有选中的元素。 */
	remove(): mdui.IjQuery<T>

	/** 在选中元素内部的前面插入指定内容。 */
	prepend(content: Selector<any>): mdui.IjQuery<T>

	/** 把选中元素添加到另一个指定元素的内部的前面。 */
	prependTo(selector: Selector<any>): mdui.IjQuery<T>

	/** 在选中元素内部的后面插入指定内容。 */
	append(content: Selector<any>): mdui.IjQuery<T>

	/** 把选中元素插入到另一个指定元素的内部的后面。 */
	appendTo(selector: Selector<any>): mdui.IjQuery<T>

	/** 在选中元素的后面插入内容。 */
	after(content: Selector<any>): mdui.IjQuery<T>

	/** 把选中元素插入到指定元素的后面。 */
	insertAfter(content: Selector<any>): mdui.IjQuery<T>

	/** 在选中元素前面插入内容。 */
	before(content: Selector<any>): mdui.IjQuery<T>

	/** 把选中元素插入到指定元素前面。 */
	insertBefore(content: Selector<any>): mdui.IjQuery<T>

	/** 用新元素替换选中元素。 */
	replaceWith(content: Selector<any>): mdui.IjQuery<T>

	/** 用选中元素替换指定元素。 */
	replaceAll(content: Selector<any>): mdui.IjQuery<T>

	/** 通过深度克隆来复制集合中的所有元素。通过原生 cloneNode 方法深度克隆来复制集合中的所有元素。 */
	clone(): mdui.IjQuery<T>
}

// 表单
interface IjQueryForm<T extends Dom> {
	/** 把表单元素的值组合成由 name 和 value 的键值对组成的数组。 */
	serializeArray(): { value: any, name: string }[]

	/** 将表单元素数组或者对象序列化。 */
	serialize(): string
}

// 事件
interface IjQueryEvent<T extends Dom> {
	/** 为每个匹配元素的特定事件绑定事件处理函数。 */
	on(event: string, handler: (this: T, e: Event) => void): mdui.IjQuery<T>
	/** 事件委托。 */
	on(event: string, proxy: string, handler: (this: T, e: Event) => void): mdui.IjQuery<T>
	/** 为每个匹配元素的特定事件绑定事件处理函数。 */
	on(events: { [key: string]: (this: T, e: Event) => void }): mdui.IjQuery<T>
	/** 为每个匹配元素的特定事件绑定事件处理函数。 */
	on(event: string, data: Object, handler: (this: T, e: Event) => void): mdui.IjQuery<T>

	/** 为每个匹配元素的特定事件绑定事件处理函数。 */
	one(event: string, handler: (this: T, e: Event) => void): mdui.IjQuery<T>
	/** 事件委托。 */
	one(event: string, proxy: string, handler: (this: T, e: Event) => void): mdui.IjQuery<T>
	/** 为每个匹配元素的特定事件绑定事件处理函数。 */
	one(events: { [key: string]: (this: T, e: Event) => void }): mdui.IjQuery<T>
	/** 为每个匹配元素的特定事件绑定事件处理函数。 */
	one(event: string, data: Object, handler: (this: T, e: Event) => void): mdui.IjQuery<T>

	/** 从每个匹配的元素中解除绑定的事件。 */
	off(event: string, proxy: string, handler?: Function): mdui.IjQuery<T>
	/** 从每个匹配的元素中解除绑定的事件。 */
	off(event: string, handler?: Function): mdui.IjQuery<T>

	/** 触发指定的事件 */
	trigger(event: string, data?: Object): mdui.IjQuery<T>

	/** DOM 加载完毕，DOMContentLoaded 事件触发时触发。 */
	ready(callback: Function): mdui.IjQuery<T>
}

// 其他
interface IjQueryOthers<T extends Dom> {
	/** 重绘当前元素。 */
	reflow(): mdui.IjQuery<T>

	/** 设置当前元素的 transition-duration 属性。 */
	transition(time?: number): mdui.IjQuery<T>

	/** 在当前元素上添加 transitionend 事件回调。 */
	transitionEnd(callback: Function): mdui.IjQuery<T>

	/** 设置当前元素的 transform 属性。 */
	transform(value: string): mdui.IjQuery<T>

	/** 设置当前元素的 transform-origin 属性。 */
	transformOrigin(value: string): mdui.IjQuery<T>
}
interface jQueryOthers {
	/** 显示遮罩层。可以传入一个整数参数，表示遮罩层的 z-index 样式，默认为 2000. */
	showOverlay(value?: number): mdui.IjQuery<HTMLDivElement>

	/** 隐藏遮罩层。如果调用了多次 $$.showOverlay() 来显示遮罩层，则也需要调用相同次数的 $$.hideOverlay() 才能隐藏遮罩层。可以通过传入参数 true 来强制隐藏遮罩层。 */
	hideOverlay(force?: boolean): void

	/** 锁定屏幕。 */
	lockScreen(): void

	/** 解锁屏幕。如果调用了多次 $$.lockScreen() 来显示遮罩层，则也需要调用相同次数的 $$.unlockScreen() 才能隐藏遮罩层。可以通过传入参数 true 来强制隐藏遮罩层。 */
	unlockScreen(force?: boolean): void

	/** 函数节流。 */
	throttle<T extends Function>(f: T, time: number): T

	/** 生成一个全局唯一的 ID。 */
	guid(): string
}

///////////////////////////////////////////////////////////////////
// Collapse
type CollapseItem = number | HTMLElement | string
interface CollapseOptions {
	/** 是否启用手风琴效果。 */
	accordion?: boolean
}
/** 折叠内容插件 https://www.mdui.org/docs/collapse */
interface Collapse {
	new (selector: string | HTMLElement, options?: CollapseOptions): {
		/** 打开内容块。 */
		open(item: CollapseItem): void
		/** 关闭内容块。 */
		close(item: CollapseItem): void
		/** 切换内容块状态。 */
		toggle(item: CollapseItem): void
		/** 打开所有内容块。该方法仅在 accordion 为 false 时有效。 */
		openAll(): void
		/** 关闭所有内容块。 */
		closeAll(): void
	}
}

interface HeadroomOptions {
	/** 滚动多少距离后触发隐藏元素。 */
	tolerance?: number
	/** 在离页面顶部多少距离后滚动时开始隐藏元素。 */
	offset?: number
	/** 初始化插件后在元素上添加的 CSS 类。 */
	initialClass?: string
	/** 固定住元素后添加的 CSS 类。 */
	pinnedClass?: string
	/** 取消固定后添加的 CSS 类。 */
	unpinnedClass?: string
}
interface Headroom {
	new (selector: string | HTMLElement, options?: HeadroomOptions): {
		/** 使元素固定住。 */
		pin(): void
		/** 使元素隐藏。 */
		unpin(): void
		/** 启用 headroom 插件。 */
		enable(): void
		/** 禁用 headroom 插件。 */
		disable(): void
		/** 获取当前元素的状态。共包含四种状态（pinning、pinned、unpinning、unpinned）。 */
		getState(): 'pinning' | 'pinned' | 'unpinning' | 'unpinned'
	}
}
///////////////////////////////////////////////////////////////////
interface Fab {
	new (selector: string | HTMLElement, options?: { trigger?: 'hover' | 'click' }): {
		/** 打开快速拨号菜单。 */
		open(): void

		/** 关闭快速拨号菜单。 */
		close(): void

		/** 切换快速拨号菜单的打开状态。 */
		toggle(): void

		/** 返回当前快速拨号菜单的打开状态。 */
		getState(): 'opening' | 'opened' | 'closing' | 'closed'

		/** 以动画的形式隐藏整个浮动操作按钮。 */
		hide(): void

		/** 以动画的形式显示整个浮动操作按钮。 */
		show(): void
	}
}

type PanelItem = number | HTMLElement | string
interface Panel {
	new (selector: string | HTMLElement, options?: { accordion?: boolean }): {
		/** 打开内容块。 */
		open(item: PanelItem): void
		/** 关闭内容块。 */
		close(item: PanelItem): void
		/** 切换内容块状态。 */
		toggle(item: PanelItem): void
		/** 打开所有内容块。该方法仅在 accordion 为 false 时有效。 */
		openAll(): void
		/** 关闭所有内容块。 */
		closeAll(): void
	}
}

interface Tab {
	new (selector: string | HTMLElement, options?: { trigger?: 'hover' | 'click', loop?: boolean }): {
		/** 切换到上一个选项 */
		prev(): void
		/** 切换到下一个选项 */
		next(): void
		/** 显示指定的选项。 */
		show(index: number): void
		/** 当父元素的宽度发生变化时，需要调用该方法重新设置指示器位置。 */
		handleUpdate(): void
	}
}

interface Drawer {
	new (selector: string | HTMLElement, options?: { overlay?: boolean }): {
		/** 显示抽屉栏。 */
		open(): void
		/** 隐藏抽屉栏。 */
		close(): void
		/** 切换抽屉栏的显示状态。 */
		toggle(): void
		/** 返回当前抽屉栏的状态。 */
		getState(): 'opening' | 'opened' | 'closing' | 'closed'
	}
}

interface Tooltip {
	new (selector: string | HTMLElement, options: {
		position?: 'auto' | 'bottom' | 'top' | 'left' | 'right',
		delay: number,
		content: string
	}): {
			/** 打开 Tooltip */
			open(): void
			/** 关闭 Tooltip */
			close(): void
			/** 切换 Tooltip */
			toggle(): void
			/** 返回 Tooltip 的状态。 */
			getState(): 'opening' | 'opened' | 'closing' | 'closed'
		}
}

interface Dialog {
	new (selector: string, params: {
		/** 打开对话框时是否显示遮罩。 */
		overlay?: boolean
		/** 打开对话框时是否添加 url hash，若为 true，则打开对话框后可用过浏览器的后退按钮或 Android 的返回键关闭对话框。 */
		history?: boolean
		/** 是否模态化对话框。为 false 时点击对话框外面的区域时关闭对话框，否则不关闭。 */
		modal?: boolean
		/** 按下 Esc 键时是否关闭对话框。 */
		closeOnEsc: boolean
		/** 按下取消按钮时是否关闭对话框。 */
		closeOnCancel: boolean
		/** 按下确认按钮时是否关闭对话框。 */
		closeOnConfirm: boolean
		/** 关闭对话框后是否自动销毁对话框。 */
		destroyOnClosed: boolean
	}): {
			/** 打开对话框。 */
			open(): void
			/** 关闭对话框。 */
			close(): void
			/** 切换对话框的打开状态。 */
			toggle(): void
			/** 获取对话框状态。 */
			getState(): 'opening' | 'opened' | 'closing' | 'closed'
			/** 销毁对话框。 */
			destroy()
			/** 重新调整对话框位置和滚动条高度。在打开对话框后，如果修改了对话框内容，需要调用该方法。 */
			handleUpdate()
		}
}

interface Menu {
	new (anchorSelector: string | HTMLElement, menuSelector: string | HTMLElement, options?: {
		/** 菜单相对于触发它的元素的位置。 */
		position?: 'top' | 'bottom' | 'center' | 'auto'
		/** 菜单与触发它的元素的对其方式。 */
		align?: 'left' | 'bottom' | 'center' | 'auto'
		/** 菜单与窗口边框至少保持多少间距，单位为 px。 */
		gutter?: number
		/** 菜单的定位方式 true：菜单使用 fixed 定位。false：菜单使用 absolute 定位。 */
		fixed?: boolean
		/** 菜单是否覆盖在触发它的元素的上面。 */
		covered?: boolean | 'auto'
		/** 子菜单的触发方式。 */
		subMenuTrigger?: 'click' | 'hover'
		/** 子菜单的触发延迟时间（单位：毫秒），只有在 subMenuTrigger: hover 时，这个参数才有效。 */
		subMenuDelay?: number
	}): {
			/** 打开菜单。 */
			open(): void
			/** 关闭菜单。 */
			close(): void
			/** 切换菜单的打开状态。 */
			toggle(): void
		}
}

///////////////////////////////////////////////////////////////////
interface MduiReloadMethods {
	/** 重新初始化文本框 */
	updateTextFields(selector?: Selector<any>): void
	/** 初始化滑块 */
	updateSliders(selector?: Selector<any>): void
	/** 初始化表格 */
	updateTables(selector?: Selector<any>): void
	/** 初始化进度条 */
	updateSpinners(selector?: Selector<any>): void
}
interface MduiDialogsInstance { }
interface MduiDialogsAlertOptions {
	/** 确认按钮的文本。 */
	confirmText?: string
	/** 是否监听 hashchange 事件，为 true 时可以通过 Android 的返回键或浏览器后退按钮关闭对话框。 */
	history?: boolean
	/** 是否模态化对话框。为 false 时点击对话框外面的区域时关闭对话框，否则不关闭。 */
	modal?: boolean
	/** 按下 Esc 键时是否关闭对话框。 */
	closeOnEsc?: boolean
}
interface MduiDialogsConfirmOptions extends MduiDialogsAlertOptions {
	/** 取消按钮的文本。 */
	cancelText?: string
}
interface MduiDialogsPromptOptions extends MduiDialogsConfirmOptions {
	/** 文本框的类型。 */
	type?: 'text' | 'textarea'
	/** 最大输入字符数量 */
	maxlength?: number
	/** 文本框的默认值 */
	defaultValue?: string
}
interface MduiDialogs {
	/** 打开一个对话框 */
	dialog(option: {
		/** 对话框的标题。 */
		title: string
		/** 对话框的内容。 */
		content: string
		/** 按钮数组，每个按钮都是一个带按钮参数的对象（见下面表格）。 */
		buttons?: {
			/** 按钮文本。 */
			text: string
			/** 按钮文本是否加粗。 */
			bold?: boolean
			/** 点击按钮后是否关闭对话框。 */
			close?: boolean
			/** 点击按钮的回调函数。 */
			onClick?: (e: Event) => void
		}[]
		/** 按钮是否垂直排列。 */
		stackedButtons?: boolean
		/** 添加到 .mdui-dialog 上的 CSS 类。 */
		cssClass?: string
		/** 是否监听 hashchange 事件，为 true 时可以通过 Android 的返回键或浏览器后退按钮关闭对话框。 */
		history?: boolean
		/** 打开对话框后是否显示遮罩层。 */
		overlay?: boolean
		/** 是否模态化对话框。为 false 时点击对话框外面的区域时关闭对话框，否则不关闭。 */
		modal?: boolean
		/** 按下 Esc 键时是否关闭对话框。 */
		closeOnEsc?: boolean
		/** 关闭对话框后是否自动销毁对话框。 */
		destroyOnClosed?: boolean
		/** 打开动画开始时的回调。参数是对话框的实例。 */
		onOpen: (e: MduiDialogsInstance) => void
		/** 打开动画结束时的回调。参数是对话框的实例。 */
		onOpened: (e: MduiDialogsInstance) => void
		/** 关闭动画开始时的回调。参数是对话框的实例。 */
		onClose: (e: MduiDialogsInstance) => void
		/** 关闭动画结束时的回调。参数是对话框的实例。 */
		onClosed: (e: MduiDialogsInstance) => void
	}): MduiDialogsInstance
	/** 打开一个警告框 */
	alert(text: string, onConfirm?: (e: MduiDialogsInstance) => void,
		onCancel?: (e: MduiDialogsInstance) => void,
		options?: MduiDialogsAlertOptions): MduiDialogsInstance
	/** 打开一个警告框 */
	alert(text: string, title?: string, onConfirm?: (e: MduiDialogsInstance) => void,
		onCancel?: (e: MduiDialogsInstance) => void,
		options?: MduiDialogsAlertOptions): MduiDialogsInstance

	/** 打开一个提示用户输入的对话框 */
	prompt(label: string, onConfirm?: (v: string, e: MduiDialogsInstance) => void,
		onCancel?: (v: string, e: MduiDialogsInstance) => void, options?: MduiDialogsPromptOptions)
	/** 打开一个提示用户输入的对话框 */
	prompt(label: string, title?: string, onConfirm?: (v: string, e: MduiDialogsInstance) => void,
		onCancel?: (v: string, e: MduiDialogsInstance) => void, options?: MduiDialogsPromptOptions)
}

declare namespace mdui {
	export interface IjQuery<T extends Dom> extends IjQueryOperations<T>,
		IjQueryCore<T>, IjQueryCSS<T>, IjQueryAttrs<T>,
		IjQueryDataStore<T>, IjQueryStyle<T>, IjQueryQuery<T>,
		IjQueryNodeOperation<T>, IjQueryForm<T>, IjQueryEvent<T>,
		IjQueryOthers<T> { }
	export interface jQueryStatic extends jQueryObjectsOperations, jQueryExtendFunctions,
		jQueryCallable, jQueryURLOperations, jQueryDataStore, jQueryOthers { }
	export interface IMduiStatic extends MduiReloadMethods {
		JQ: jQueryStatic
		Collapse: Collapse
		Haedroom: Headroom
		Fab: Fab
		Tab: Tab
		Drawer: Drawer
		Tooltip: Tooltip
		Dialog: Dialog
		Menu: Menu

		snackbar(param: {
			/** Snackbar 的文本，该参数不能为空。 */
			message: string
			/** 在用户没有操作时多长时间自动隐藏，单位（毫秒）。 */
			timeout?: number
			/** 按钮的文本。 */
			buttonText?: string
			/** 按钮的文本颜色，可以是颜色名或颜色值，如 red、#ffffff、rgba(255, 255, 255, 0.3) 等。 */
			buttonColor?: string
			/** 点击按钮时是否关闭 Snackbar。 */
			closeOnButtonClick?: boolean
			/** 点击或触摸 Snackbar 以外的区域时是否关闭 Snackbar。 */
			closeOnOutsideClick?: boolean
			/** 在 Snackbar 上点击的回调函数。 */
			onClick?: (e: Event) => void
			/** 点击 Snackbar 上的按钮时的回调函数。 */
			onButtonClick?: (e: Event) => void
			/** Snackbar 开始关闭时的回调函数。 */
			onClose?: (e: Event) => void
		}): {
				/** 关闭 Snackbar，关闭后 Snackbar 会被销毁。*/
				close(): void
			}
	}
}

declare var mdui: mdui.IMduiStatic;
declare module "mdui" {
	export = mdui;
}
