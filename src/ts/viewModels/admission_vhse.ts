"use strict";

import * as ko from "knockout";
import componentStrings = require("ojL10n!./resources/nls/dynamic-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import "ojs/ojknockout";
import "ojs/ojtable";
import $ = require("jquery");
import "ojs/ojselectsingle";
import PapaParse = require("papaparse");

import { whenDocumentReady } from "ojs/ojbootstrap";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import ListDataProviderView = require("ojs/ojlistdataproviderview");
import { DataFilter } from "ojs/ojdataprovider";
import { IntlNumberConverter } from "ojs/ojconverter-number";
import { ojCheckboxset } from "ojs/ojcheckboxset";
import "ojs/ojcheckboxset";
import { ojSelectSingle } from "ojs/ojselectsingle";
import "ojs/ojselectsingle";
import "ojs/ojdataprovider";
import "ojs/ojconverter-number";
import "ojs/ojknockout";
import "ojs/ojlistview";
import "ojs/ojgauge";
import "ojs/ojbutton";
import "ojs/ojlistitemlayout";
import * as AccUtils from "../accUtils";

//tooltip import start
import * as Bootstrap from 'ojs/ojbootstrap';
import { ojPopup } from 'ojs/ojpopup';
import 'ojs/ojpopup';
import { ojInputText } from "@oracle/oraclejet/dist/types/ojinputtext";
//tooltip import end

class VhseAdmissionViewModel {

  private page: string;
  componentType: ko.Observable<string>;

  //tooltip var start
  private static readonly _AUTO_TIMEOUT: number = 300;
  private static readonly _OPEN_DELAY: number = 500;
  private static readonly _CONTEXT_NODE: string = 'tooltip-context-node';
  private _helpDataAttr: string;
  private _rootElement: HTMLElement;
  private _tooltipPopupId: string;
  private _timeoutId: number;
  //tooltip var end

  private readonly districts = [
    { value: "", label: "All" },
    { value: "Thiruvananthapuram", label: "Thiruvananthapuram" },
    { value: "Kollam", label: "Kollam" },
    { value: "Alappuzha", label: "Alappuzha" },
    { value: "Pathanamthitta", label: "Pathanmathitta" },
    { value: "Kottayam", label: "Kottayam" },
    { value: "Idukki", label: "Idukki" },
    { value: "Ernakulam", label: "Ernakulam" },
    { value: "Thrissur", label: "Thrissur" },
    { value: "Palakkad", label: "Palakkad" },
    { value: "Malappuram", label: "Malappuram" },
    { value: "Kozhikkode", label: "Kozhikkode" },
    { value: "Wayanadu", label: "Wayanadu" },
    { value: "Kannur", label: "Kannur" },
    { value: "Kasargode", label: "Kasargode" }
  ];

  readonly districtsDP = new ArrayDataProvider(this.districts, {
    keyAttributes: "value",
  });

courseDP = new ArrayDataProvider([], {
    keyAttributes: "value",
  });

  langDP = new ArrayDataProvider([], {
    keyAttributes: "value",
  });

private readonly sortCriteriaMap = {};
private readonly genderFilterCriteriaMap = {};
private readonly ratingFilterCriteriaMap = {};
private readonly districtFilterCriteriaMap = {};
private priceCriteria = [];
private ratingCriteria = [];
private authorCriteria = [];
private codeCriteria = [];
private nameCriteria = [];
private courseCriteria = [];
private langCriteria = [];
private currentSortCriteria;
private currentFilterCriterion;
private readonly currencyOptions: IntlNumberConverter.ConverterOptions = {
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol",
};
readonly currencyConverter = new IntlNumberConverter(this.currencyOptions);
baseDataProvider;
dataProvider = ko.observable();
courseDataProvider = ko.observable();
langDataProvider = ko.observable();
readonly currentSort = ko.observable("default");
private readonly options = [
  {
    value: "default",
    label: "New and Popular",
  },
  {
    value: "lh",
    label: "Price: Low to High",
  },
  {
    value: "hl",
    label: "Price: High to Low",
  },
  {
    value: "reviews",
    label: "Most Reviews",
  },
  {
    value: "date",
    label: "Publication Date",
  },
];
readonly optionsDataProvider = new ArrayDataProvider(this.options, {
  keyAttributes: "value",
});
getImage = (url: string) => {
  return {
    backgroundImage: "url(" + url + ")",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%",
    backgroundPosition: "center",
    height: "172px",
    width: "140px",
  };
};
handleSortCriteriaChanged = (
    // @ts-ignore
  event: ojSelectSingle.valueChanged<OptionData["value"], OptionData>
) => {
  let sortCriteria = this.sortCriteriaMap[event.detail.value];
  if (sortCriteria != null) {
    sortCriteria = [sortCriteria];
  }
  this.currentSortCriteria = sortCriteria;
  this.dataProvider(
    new ListDataProviderView(this.baseDataProvider, {
      filterCriterion: this.currentFilterCriterion,
      sortCriteria: sortCriteria,
    })
  );
};

handleGenderFilterChanged = (
    // @ts-ignore
  event: ojCheckboxset.valueChanged<OptionData["value"], OptionData>
) => {
  this.priceCriteria = this._getCriteria(event, this.genderFilterCriteriaMap);
  this._handleFilterChanged();
};

handleRatingFilterChanged = (
    //@ts-ignore
  event: ojCheckboxset.valueChanged<OptionData["value"], OptionData>
) => {
  this.ratingCriteria = this._getCriteria(
    event,
    this.ratingFilterCriteriaMap
  );
  this._handleFilterChanged();
};

handleCodeFilterChanged = (
  //@ts-ignore
event: ojInputText.valueChanged<OptionData["value"], OptionData>
) => { 
const criteria = new Array();
if(event.detail.value ) {
  criteria.push({ op: "$eq", value: { schoolcode: event.detail.value } });
}
this.codeCriteria = criteria;
this._handleFilterChanged();
};

handleNameFilterChanged = (
  //@ts-ignore
event: ojInputText.valueChanged<OptionData["value"], OptionData>
) => { 
const criteria = new Array();
if(event.detail.value ) {
  criteria.push({ op: "$co", value: { name: event.detail.value.toUpperCase  () } });
}
this.nameCriteria = criteria;
this._handleFilterChanged();
};



handleDistrictFilterChanged = (
    //@ts-ignore
  event: ojSelectSingle.valueChanged<OptionData["value"], OptionData>
) => { 
  const criteria = new Array();
  if(event.detail.value ) {
    criteria.push({ op: "$eq", value: { district: event.detail.value } });
  }
  this.authorCriteria = criteria;
  this._handleFilterChanged();
};

handleCourseFilterChanged = (
    //@ts-ignore
  event: ojSelectSingle.valueChanged<OptionData["value"], OptionData>
) => {
  const criteria = new Array();
    if(event.detail.value && event.detail.value != "All") {
        
        criteria.push({ op: "$co", value: { courses: event.detail.value } });
        console.log(event.detail.value);

    }
    this.courseCriteria = criteria;
        
    this._handleFilterChanged();
 
};

handleLangFilterChanged = (
  //@ts-ignore
event: ojSelectSingle.valueChanged<OptionData["value"], OptionData>
) => {
  const criteria = new Array();
  if(event.detail.value && event.detail.value != "All") {
      criteria.push({ op: "$co", value: { secondlanguagestooltip: event.detail.value } });
      console.log(event.detail.value);
  }
  this.langCriteria = criteria;
      
  this._handleFilterChanged();

};

private _getCriteria = (
    //@ts-ignore
  event: ojCheckboxset.valueChanged<OptionData["value"], OptionData>,
  criteriaMap
) => {
  const criteria = new Array();
  const values = event.detail.value;
  values.forEach(function (value) {
    const filter = criteriaMap[value];
    if (filter) {
      criteria.push(filter);
    }
  });
  return criteria;
};

private _handleFilterChanged = () => {
  const criteria = new Array();
  if (this.priceCriteria.length > 0) {
    criteria.push({ op: "$or", criteria: this.priceCriteria });
  }
  if (this.ratingCriteria.length > 0) {
    criteria.push({ op: "$or", criteria: this.ratingCriteria });
  }
  if (this.authorCriteria.length > 0) {
    criteria.push({ op: "$or", criteria: this.authorCriteria });
  }
  if (this.codeCriteria.length > 0) {
    criteria.push({ op: "$or", criteria: this.codeCriteria });
  }
  if (this.nameCriteria.length > 0) {
    criteria.push({ op: "$or", criteria: this.nameCriteria });
  }
  if (this.courseCriteria.length > 0) {
    criteria.push({ op: "$or", criteria: this.courseCriteria });
  }
  if (this.langCriteria.length > 0) {
    criteria.push({ op: "$or", criteria: this.langCriteria });
  }

  const filterCriterion =
    criteria.length === 0 ? null : { op: "$and", criteria: criteria };
  this.currentFilterCriterion = filterCriterion;
  this.dataProvider(
    new ListDataProviderView(this.baseDataProvider, {
      filterCriterion: filterCriterion as DataFilter.Filter<any>,
      sortCriteria: this.currentSortCriteria,
    })
  );
};

constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {        
    
  //tooltip constructor start
  this._helpDataAttr = 'data-title';
    this._rootElement = document.getElementById('pageContent');
  
    let uniqueId = 'id' + (new Date()).getTime();
    uniqueId = 'idPopupId';
    let tooltipPopup = document.createElement('oj-popup') as ojPopup;
    tooltipPopup.setAttribute('id', uniqueId);
    tooltipPopup.style.maxWidth = '530px';
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
    //this._rootElement.addEventListener('focus', this._handleClose, true);
    //tooltip constructor end
  
  //At the start of your viewModel constructor
    const elementContext: Context = Context.getContext(context.element);
    const busyContext: Context.BusyContext = elementContext.getBusyContext();
    const options = {"description": "Web Component Startup - Waiting for data"};

    //Example observable
    // Example for parsing context properties
    // if (context.properties.name) {
    //     parse the context properties here
    // }

    this.sortCriteriaMap["lh"] = { attribute: "PRICE", direction: "ascending" };
  this.sortCriteriaMap["hl"] = {
    attribute: "PRICE",
    direction: "descending",
  };
  this.sortCriteriaMap["reviews"] = {
    attribute: "REVIEWS",
    direction: "descending",
  };
  this.sortCriteriaMap["date"] = {
    attribute: "PUBLISH_DATE",
    direction: "ascending",
  };

  this.genderFilterCriteriaMap["boys"] = { op: "$eq", value: { gender: 'Boys' } };
  this.genderFilterCriteriaMap["girls"] = { op: "$eq", value: { gender: 'Girls' } };
  this.genderFilterCriteriaMap["mixed"] = { op: "$eq", value: { gender: 'Mixed' } };

  this.ratingFilterCriteriaMap["two"] = { op: "$lt", value: { RATING: 3 } };
  this.ratingFilterCriteriaMap["three"] = { op: "$ge", value: { RATING: 3 } };
  this.ratingFilterCriteriaMap["four"] = { op: "$ge", value: { RATING: 4 } };
  this.ratingFilterCriteriaMap["five"] = { op: "$eq", value: { RATING: 5 } };
  
  this.districtFilterCriteriaMap["All"] ={ op: "$eq", value: { district: 'Thiruvananthapuram' } };
  this.districtFilterCriteriaMap["Thiruvananthapuram"] ={ op: "$eq", value: { district: 'Thiruvananthapuram' } };
  this.districtFilterCriteriaMap["Kollam"] ={ op: "$eq", value: { district: 'Kollam' } };
  this.districtFilterCriteriaMap["alp"] ={ op: "$eq", value: { district: 'alp' } };
  this.districtFilterCriteriaMap["pta"] ={ op: "$eq", value: { district: 'pta' } };
  this.districtFilterCriteriaMap["ktm"] ={ op: "$eq", value: { district: 'ktm' } };
  this.districtFilterCriteriaMap["idk"] ={ op: "$eq", value: { district: 'idk' } };
  this.districtFilterCriteriaMap["ekm"] ={ op: "$eq", value: { district: 'ekm' } };
  this.districtFilterCriteriaMap["tsr"] ={ op: "$eq", value: { district: 'tsr' } };
  this.districtFilterCriteriaMap["pkd"] ={ op: "$eq", value: { district: 'pkd' } };
  this.districtFilterCriteriaMap["mlp"] ={ op: "$eq", value: { district: 'mlp' } };
  this.districtFilterCriteriaMap["kkd"] ={ op: "$eq", value: { district: 'kkd' } };
  this.districtFilterCriteriaMap["wnd"] ={ op: "$eq", value: { district: 'wnd' } };
  this.districtFilterCriteriaMap["knr"] ={ op: "$eq", value: { district: 'knr' } };
  this.districtFilterCriteriaMap["kgd"] ={ op: "$eq", value: { district: 'kgd' } };
  
  this.dataProvider = ko.observable();
  this.baseDataProvider = ko.observable();
  this.baseDataProvider = new ArrayDataProvider(JSON.parse("[]"), {
    keyAttributes: "ID",
  });
  
  this.dataProvider = ko.observable(this.baseDataProvider);
  this.courseDataProvider = ko.observable(this.courseDP);
  this.langDataProvider = ko.observable(this.langDP);
  let self = this;
  //   Tabletop.init( {
  //   key: 'https://docs.google.com/spreadsheets/d/1H3MXhBiqV0V-4HCQGymJSKH4O5ODpJPLnjzLouCfqzw/pubhtml',
  //   simpleSheet: false,
  //   prettyColumnNames: false,
  //   wanted: ['SchoolsVhse', 'CoursesVhse', 'SecondLanguageVhse'],
  //  }
  // ).then(function(data, tabletop) { 
  //   self.baseDataProvider = new ArrayDataProvider(data.SchoolsVhse.elements, {
  //       keyAttributes: "ID",
  //     });

  //     self.courseDP = new ArrayDataProvider(data.CoursesVhse.elements, {
  //       keyAttributes: "value",
  //     });
  //     self.courseDataProvider(
  //       new ListDataProviderView(self.courseDP)
  //     );
      
  //     self.langDataProvider(
  //       new ListDataProviderView(self.langDP)
  //     );
  //     self.dataProvider(
  //       new ListDataProviderView(self.baseDataProvider)
  //     );
  // })

  PapaParse.parse('https://docs.google.com/spreadsheets/d/1H3MXhBiqV0V-4HCQGymJSKH4O5ODpJPLnjzLouCfqzw/gviz/tq?tqx=out:csv&sheet=SchoolsVhse', {
          download: true,
          header: true,
          complete: function(results) {
            console.log(results.data);
            self.baseDataProvider = new ArrayDataProvider(results.data, {
              keyAttributes: "ID",
            });
            self.dataProvider(
              new ListDataProviderView(self.baseDataProvider)
            );
          }
  });

  PapaParse.parse('https://docs.google.com/spreadsheets/d/1H3MXhBiqV0V-4HCQGymJSKH4O5ODpJPLnjzLouCfqzw/gviz/tq?tqx=out:csv&sheet=CoursesVhse', {
    download: true,
    header: true,
    complete: function(results) {
      self.courseDP = new ArrayDataProvider(results.data, {
        keyAttributes: "value",
      });
      self.courseDataProvider(
        new ListDataProviderView(self.courseDP)
      );
    }
  });

    // PapaParse.parse('https://docs.google.com/spreadsheets/d/1H3MXhBiqV0V-4HCQGymJSKH4O5ODpJPLnjzLouCfqzw/gviz/tq?tqx=out:csv&sheet=SecondLanguageVhse', {
    //   download: true,
    //   header: true,
    //   complete: function(results) {
    //     self.langDP = new ArrayDataProvider(results.data, {
    //     keyAttributes: "label",
    //   });
    //   self.langDataProvider(
    //     new ListDataProviderView(self.langDP)
    //   );
    //   }
    // });

//   this.baseDataProvider = new ArrayDataProvider(JSON.parse(jsonDataStr), {
//     keyAttributes: "ID",
//   });
//   this.dataProvider = ko.observable(this.baseDataProvider);

    //Once all startup and async activities have finished, relocate if there are any async activities
   
}
  
//tooltip helper method start
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
    let oldNode = this.data(popup, VhseAdmissionViewModel._CONTEXT_NODE, null);
    let titleContextCopy = titleContext;
    if (oldNode && oldNode === titleContext.node) { return; }

    setTimeout(() => {
      this.data(popup, VhseAdmissionViewModel._CONTEXT_NODE, titleContextCopy.node);
      let content = this._getContentNode(popup) as Element;
      content.innerHTML = titleContextCopy.title;
      popup.open(target as HTMLElement);
    },
    VhseAdmissionViewModel._OPEN_DELAY);
  }
};

private _getContentNode(popup: HTMLElement) {
  let content = popup.querySelector('.oj-popup-content');
  return content;
};

private _handleSetTimeout() {
  this._timeoutId = window.setTimeout(this._handleClose, VhseAdmissionViewModel._AUTO_TIMEOUT);
};

private _handleClearTimeout() {
  let timeoutId = this._timeoutId;
  delete this._timeoutId;
  window.clearTimeout(timeoutId);
};

private _handleCleanup(event: CustomEvent) {
  let popup = event.target as ojPopup;
  this.data(popup, VhseAdmissionViewModel._CONTEXT_NODE, null);
};

private _handleClose = () => {
  let tooltipPopupId = this._tooltipPopupId;
  let popup = document.getElementById(tooltipPopupId) as ojPopup;

  let isOpen = false;
  if(popup) {
    isOpen = !popup.isOpen();
  }
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
//tooltip helper method end


  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    AccUtils.announce("Dashboard page loaded.");
    document.title = "VHSE School Finder";
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

export = VhseAdmissionViewModel;
