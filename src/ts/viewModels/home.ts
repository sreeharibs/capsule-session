import * as AccUtils from "../accUtils";

import * as ko from "knockout";
import { whenDocumentReady } from "ojs/ojbootstrap";
import { DataFilter, FilterFactory } from "ojs/ojdataprovider";

import ArrayDataProvider = require("ojs/ojarraydataprovider");

import ListDataProviderView = require("ojs/ojlistdataproviderview");
import "ojs/ojknockout";
import "ojs/ojwaterfalllayout";
import "ojs/ojactioncard";
import "ojs/ojbutton";
import { ojButtonsetOne } from "ojs/ojbutton";
import "ojs/ojavatar";

import Tabletop = require("tabletop");
import $ = require("jquery");
import CoreRouter = require("@oracle/oraclejet/dist/types/ojcorerouter");

interface Data {
  type: string;
  id: string;
  name: string;
  head?: string;
  count?: string;
  title?: string;
  work?: number;
  email?: string;
  initials?: string;
}

class CustomersViewModel {

  baseDataProvider;
  dataProvider = ko.observable();

  private router: CoreRouter;

  readonly filters = "all";

  clickListener = (
    event: Event,
    bindingContext: ko.BindingContext
  ) => {
    var href = $(event.currentTarget).data('link');
    if(href.includes("capsulesession.com")) {
      href = href.split('ojr=')[1];
      if(href.startsWith('videos')){
        var otherParams = href.split("$");
        this.router.go({path: otherParams[0], params: {'class': otherParams[1], 'subject':otherParams[2]}})
      }else {
        this.router.go({path: href});
      }
      
    }else{
      window.open(href, '_blank');
    }
    
  };
  

  handleFilterChanged = (event: ojButtonsetOne.valueChanged) => {
    const value = event.detail.value;

    if (value === "all") {
      this.dataProvider(this.baseDataProvider);
    } else {
      const filter = {
        op: "$co",
        value: {
          tags: value,
        },
      };
      this.dataProvider(
        new ListDataProviderView(this.baseDataProvider, {
          filterCriterion: filter as DataFilter.Filter<Data>,
        })
      );
    }
  };

  constructor(context) {

    this.router = context.parentRouter;
    this.dataProvider = ko.observable();
    this.baseDataProvider = ko.observable();
    this.baseDataProvider = new ArrayDataProvider(JSON.parse("[]"), {
      keyAttributes: "ID",
    });
    
    this.dataProvider = ko.observable(this.baseDataProvider);
    let self = this;
      Tabletop.init( {
      key: 'https://docs.google.com/spreadsheets/d/1H3MXhBiqV0V-4HCQGymJSKH4O5ODpJPLnjzLouCfqzw/pubhtml',
      simpleSheet: false,
      prettyColumnNames: false,
      singleton: true,
      wanted: ['Home'], }
    ).then(function(data, tabletop) { 
      self.baseDataProvider = new ArrayDataProvider(data.Home.elements, {
          keyAttributes: "ID",
        });
        self.dataProvider(
          new ListDataProviderView(self.baseDataProvider)
        );
    })

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
    AccUtils.announce("Customers page loaded.");
    document.title = "Capsule Session";
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

export = CustomersViewModel;
