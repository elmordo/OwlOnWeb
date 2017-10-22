import { AbstractRenderer, IRenderer, RenderResult, EntryNodeLookup } from "../../../rendering"
import { CommonHtmlNode, CommonHtmlElement, DomManipulator, CommonNodeList } from "../../../dom"
import { ServiceManager } from "../../../service_management"
import { ComponentFactory, ComponentDescription, SizeableComponent } from "../../../component"


export class Renderer extends AbstractRenderer {

    static TEMPLATE: string = "<div class='owl-vbox'></div>";

    static WRAPPER_TEMPLATE: string = "<div class='owl-vbox-item'></div>";

    public render(originalNode: CommonHtmlNode, manipulator: DomManipulator, options: Object) : RenderResult {
        let rootNode: CommonHtmlElement = manipulator.createNewFragment(Renderer.TEMPLATE);
        let entryNodes: EntryNodeLookup = new EntryNodeLookup();
        let originalElement = <CommonHtmlElement>originalNode;

        while (originalElement.element.children.length) {
            let page: Element = originalElement.element.children.item(0);

            if (page.tagName != "OWL:OWL-VERTICAL-BOX-ITEM")
                throw new Error("Slider's children could be only 'owl:owl-vertical-box-item', but '" + page.tagName + "' found.");

            originalElement.element.removeChild(page);
            this._addItemFromTag(rootNode, page, -1, manipulator);
        }

        let result: RenderResult = new RenderResult(rootNode, entryNodes);
        return result;
    }

    /**
     * read options from the original node
     * @param {CommonHtmlNode} originalNode original node
     * @return {Object} parsed options
     */
    public getOptions(originalNode: CommonHtmlNode): Object {
        let result: Object = super.getOptions(originalNode);
        result["sizer"] = super._getAttributeValue(<CommonHtmlElement>originalNode, "sizer");

        return result;
    }

    public addItem(target: CommonHtmlElement, content: Node, index: number, manipulator: DomManipulator) {
        let wrappedContent: CommonHtmlElement = this._wrapItem(content, manipulator);
        this._addPageToTarget(target, wrappedContent, index);
    }

    protected _addItemFromTag(target: CommonHtmlElement, itemContainer: Element, index:number, domManipulator: DomManipulator) : void {
        let containerElement: CommonHtmlElement = domManipulator.createNewFragment(Renderer.WRAPPER_TEMPLATE);
        let contentSize = this._getAttributeValue(<CommonHtmlElement>domManipulator.mapNode(itemContainer), "size", "auto");
        containerElement.attributes.set("size", contentSize);

        while (itemContainer.childNodes.length)
            containerElement.element.appendChild(itemContainer.childNodes.item(0));

        this._addPageToTarget(target, containerElement, index);
    }

    private _addPageToTarget(target: CommonHtmlElement, pageContainer: CommonHtmlElement, index: number) : void {
        let children = target.chidlren.filter((n) => { return n instanceof CommonHtmlElement; });

        if (index == -1 || index >= children.length) {
            target.append(pageContainer);
        } else {
            target.insertBeforeNode(pageContainer, children[index]);
        }
    }

    protected _wrapItem(content: Node, domManipulator: DomManipulator) : CommonHtmlElement {
        let wrapper: CommonHtmlElement = domManipulator.createNewFragment(Renderer.WRAPPER_TEMPLATE);
        wrapper.append(domManipulator.mapNode(content));
        return wrapper;
    }
}


export class Controller extends SizeableComponent {

    public repaint() : void {
        let rootElement: CommonHtmlElement = <CommonHtmlElement>this._view.rootNode;
        let children: CommonNodeList = rootElement.chidlren;

        let byContent: CommonNodeList, byAuto: CommonNodeList;
        [byContent, byAuto] = this._categorizeChildren(children);
    }

    private _categorizeChildren(children: CommonNodeList) : CommonNodeList[] {
        let result: CommonNodeList[] = new Array<CommonNodeList>();

        return result;
    }
}


class ItemInfo {

}


export function register(cf: ComponentFactory, sm: ServiceManager): void {
    let baseNs = "owl.component.layout.vertical-box";

    let rendererName: string = baseNs + ".renderer";
    let controllerName: string = baseNs + ".controller";

    sm.registerService(rendererName, () => { return new Renderer(); });
    sm.registerService(controllerName, () => { return new Controller(); });

    let dsc: ComponentDescription = new ComponentDescription("owlVerticalBox", rendererName, controllerName);
    cf.registerComponent(dsc);
}