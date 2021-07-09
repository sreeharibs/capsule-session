import * as AccUtils from "../accUtils";
import * as Bootstrap from 'ojs/ojbootstrap';
import { ojPopup } from 'ojs/ojpopup';
import 'ojs/ojpopup';

class AboutViewModel {

  private static readonly _AUTO_TIMEOUT: number = 300;
  private static readonly _OPEN_DELAY: number = 500;
  private static readonly _CONTEXT_NODE: string = 'tooltip-context-node';
  private _helpDataAttr: string;
  private _rootElement: HTMLElement;
  private _tooltipPopupId: string;
  private _timeoutId: number;

  constructor() {

    this._helpDataAttr = 'data-title';
    this._rootElement = document.getElementById('pageContent');
  
    let uniqueId = 'id' + (new Date()).getTime();
    uniqueId = 'idPopupId';
    let tooltipPopup = document.createElement('oj-popup') as ojPopup;
    tooltipPopup.setAttribute('id', uniqueId);
    tooltipPopup.style.maxWidth = '340px';
    this._rootElement.appendChild(tooltipPopup);
    this._tooltipPopupId = tooltipPopup.getAttribute('id') as string;
  
    let callbackClearTimeout = this._handleClearTimeout;
    let callbackSetTimeout = this._handleSetTimeout;
    let callbackCleanup = this._handleCleanup;
  
    tooltipPopup.position = {
      my: { horizontal: 'start', vertical: 'top' },
      offset: { x: 0, y: 10 },
      at: { horizontal: 'start', vertical: 'bottom' }
    };
  
    tooltipPopup.initialFocus = 'none';
    tooltipPopup.autoDismiss = 'focusLoss';
    tooltipPopup.modality = 'modeless';
    tooltipPopup.addEventListener('ojOpen', callbackSetTimeout);
    tooltipPopup.addEventListener('ojClose', callbackCleanup);
    tooltipPopup.addEventListener('ojBeforeClose', callbackClearTimeout);
    tooltipPopup.addEventListener('ojFocus', callbackClearTimeout);
    tooltipPopup.addEventListener('mouseenter', callbackClearTimeout);
  
  
    this._rootElement.addEventListener('mouseenter', this._handleOpen, true);
    this._rootElement.addEventListener('focus', this._handleClose, true);

  }

  public data (el: HTMLElement, attr: string, val: HTMLElement | null) {
  
    let attributes = new WeakMap();
    let elAttrs = attributes.get(el);
    let isSetOperation = arguments.length > 2;

    if (isSetOperation) {
      if (!elAttrs) attributes.set(el, elAttrs = {});
      elAttrs[attr] = val;
    } else {
      return datasetOrCachedAttrsValue();
    }
 
    function datasetOrCachedAttrsValue() {
      let attrVal = el.dataset[attr];

      return typeof attrVal !== 'undefined' ?
                  attrVal :
                  elAttrs && elAttrs[attr];
    }
  };
  
  private _handleOpen = (event: Event) => {
    let target = event.target as ojPopup;
    let titleContext = this._getTitleContext(target);
  
    let tooltipPopupId = this._tooltipPopupId;
    let popup = document.getElementById(tooltipPopupId) as ojPopup;
  
    if (titleContext) {
      let oldNode = this.data(popup, AboutViewModel._CONTEXT_NODE, null);
      let titleContextCopy = titleContext;
      if (oldNode && oldNode === titleContext.node) { return; }
  
      setTimeout(() => {
        this.data(popup, AboutViewModel._CONTEXT_NODE, titleContextCopy.node);
        let content = this._getContentNode(popup) as Element;
        content.innerHTML = titleContextCopy.title;
        popup.open(target as HTMLElement);
      },
      AboutViewModel._OPEN_DELAY);
    }
  };
  
  private _getContentNode(popup: HTMLElement) {
    let content = popup.querySelector('.oj-popup-content');
    return content;
  };
  
  private _handleSetTimeout() {
    this._timeoutId = window.setTimeout(this._handleClose, AboutViewModel._AUTO_TIMEOUT);
  };
  
  private _handleClearTimeout() {
    let timeoutId = this._timeoutId;
    delete this._timeoutId;
    window.clearTimeout(timeoutId);
  };
  
  private _handleCleanup(event: CustomEvent) {
    let popup = event.target as ojPopup;
    this.data(popup, AboutViewModel._CONTEXT_NODE, null);
  };
  
  private _handleClose = () => {
    let tooltipPopupId = this._tooltipPopupId;
    let popup = document.getElementById(tooltipPopupId) as ojPopup;
  
    let isOpen = !popup.isOpen();
    if (!isOpen) {
      popup.close();
    }
  };
  
  private _getTitleContext(node: ojPopup) {
    let helpDataAttr = this._helpDataAttr;
    let i = 0;
    let MAX_PARENTS = 5;
  
    // eslint-disable-next-line no-plusplus
    while ((node !== null) && (i++ < MAX_PARENTS)) {
      if (node.nodeType === 1) {
        let title = node.getAttribute(helpDataAttr);
        if (title && title.length > 0) { return { title: title, node: node }; }
      }
      // eslint-disable-next-line no-param-reassign
      node = node.parentNode as ojPopup;

    }
    return null;
  };

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    AccUtils.announce("About page loaded.");
    document.title = "About";
    // implement further logic if needed
  }

  /**
   * Optional ViewModel method invoked after the View is disconnected from the DOM.
   */
  disconnected(): void {
    // implement if needed
  }

  /**
   * Optional ViewModel method invoked after transition to the new View is complete.
   * That includes any possible animation between the old and the new View.
   */
  transitionCompleted(): void {
    // implement if needed
  }
}

export = AboutViewModel;