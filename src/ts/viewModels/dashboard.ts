"use strict";

import * as ko from "knockout";
import componentStrings = require("ojL10n!./resources/nls/dynamic-component-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import "ojs/ojknockout";
import "ojs/ojtable";
import $ = require("jquery");
import "ojs/ojselectsingle";
import Tabletop = require("tabletop");

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
class DashboardViewModel {

  schoolObservableArray: ko.ObservableArray;
  private page: string;
  componentType: ko.Observable<string>;
  sheetData: any;

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

private readonly sortCriteriaMap = {};
private readonly genderFilterCriteriaMap = {};
private readonly ratingFilterCriteriaMap = {};
private readonly districtFilterCriteriaMap = {};
private priceCriteria = [];
private ratingCriteria = [];
private authorCriteria = [];
private courseCriteria = [];
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

handleDistrictFilterChanged = (
    //@ts-ignore
  event: ojSelectSingle.valueChanged<OptionData["value"], OptionData>
) => { 
  const criteria = new Array();
  if(event.detail.value) {
    criteria.push({ op: "$eq", value: { District: event.detail.value } });
  }
  this.authorCriteria = criteria;
  this._handleFilterChanged();
};

handleCourseFilterChanged = (
    //@ts-ignore
  event: ojSelectSingle.valueChanged<OptionData["value"], OptionData>
) => {
    if(event.detail.value) {
        const criteria = new Array();
        criteria.push({ op: "$co", value: { Courses: event.detail.value } });
        console.log(event.detail.value);
        this.courseCriteria = criteria;
        
        this._handleFilterChanged();
    }
 
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
  if (this.courseCriteria.length > 0) {
    criteria.push({ op: "$or", criteria: this.courseCriteria });
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

  this.genderFilterCriteriaMap["boys"] = { op: "$eq", value: { Gender: 'Boys' } };
  this.genderFilterCriteriaMap["girls"] = { op: "$eq", value: { Gender: 'Girls' } };
  this.genderFilterCriteriaMap["mixed"] = { op: "$eq", value: { Gender: 'Mixed' } };

  this.ratingFilterCriteriaMap["two"] = { op: "$lt", value: { RATING: 3 } };
  this.ratingFilterCriteriaMap["three"] = { op: "$ge", value: { RATING: 3 } };
  this.ratingFilterCriteriaMap["four"] = { op: "$ge", value: { RATING: 4 } };
  this.ratingFilterCriteriaMap["five"] = { op: "$eq", value: { RATING: 5 } };
  
  this.districtFilterCriteriaMap["All"] ={ op: "$eq", value: { District: 'Thiruvananthapuram' } };
  this.districtFilterCriteriaMap["Thiruvananthapuram"] ={ op: "$eq", value: { District: 'Thiruvananthapuram' } };
  this.districtFilterCriteriaMap["Kollam"] ={ op: "$eq", value: { District: 'Kollam' } };
  this.districtFilterCriteriaMap["alp"] ={ op: "$eq", value: { District: 'alp' } };
  this.districtFilterCriteriaMap["pta"] ={ op: "$eq", value: { District: 'pta' } };
  this.districtFilterCriteriaMap["ktm"] ={ op: "$eq", value: { District: 'ktm' } };
  this.districtFilterCriteriaMap["idk"] ={ op: "$eq", value: { District: 'idk' } };
  this.districtFilterCriteriaMap["ekm"] ={ op: "$eq", value: { District: 'ekm' } };
  this.districtFilterCriteriaMap["tsr"] ={ op: "$eq", value: { District: 'tsr' } };
  this.districtFilterCriteriaMap["pkd"] ={ op: "$eq", value: { District: 'pkd' } };
  this.districtFilterCriteriaMap["mlp"] ={ op: "$eq", value: { District: 'mlp' } };
  this.districtFilterCriteriaMap["kkd"] ={ op: "$eq", value: { District: 'kkd' } };
  this.districtFilterCriteriaMap["wnd"] ={ op: "$eq", value: { District: 'wnd' } };
  this.districtFilterCriteriaMap["knr"] ={ op: "$eq", value: { District: 'knr' } };
  this.districtFilterCriteriaMap["kgd"] ={ op: "$eq", value: { District: 'kgd' } };
  
  this.dataProvider = ko.observable();
  this.baseDataProvider = ko.observable();
  this.baseDataProvider = new ArrayDataProvider(JSON.parse("[]"), {
    keyAttributes: "ID",
  });
  
  this.dataProvider = ko.observable(this.baseDataProvider);
  this.courseDataProvider = ko.observable(this.courseDP);
  let self = this;
    Tabletop.init( {
    key: 'https://docs.google.com/spreadsheets/d/1H3MXhBiqV0V-4HCQGymJSKH4O5ODpJPLnjzLouCfqzw/pubhtml',
    simpleSheet: false }
  ).then(function(data, tabletop) { 
    self.sheetData = data.Schools1.elements;
    self.baseDataProvider = new ArrayDataProvider(data.Schools1.elements, {
        keyAttributes: "ID",
      });

      self.courseDP = new ArrayDataProvider(data.Courses.elements, {
        keyAttributes: "value",
      });
      self.courseDataProvider(
        new ListDataProviderView(self.courseDP)
      );
      self.dataProvider(
        new ListDataProviderView(self.baseDataProvider)
      );
  })

//   this.baseDataProvider = new ArrayDataProvider(JSON.parse(jsonDataStr), {
//     keyAttributes: "ID",
//   });
//   this.dataProvider = ko.observable(this.baseDataProvider);

    //Once all startup and async activities have finished, relocate if there are any async activities
   
}
  

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
    document.title = "Dashboard";
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

export = DashboardViewModel;
