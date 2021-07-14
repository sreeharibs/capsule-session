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

  readonly filters = "all";

  clickListener = (
    event: Event,
    bindingContext: ko.BindingContext
  ) => {
    var href = $(event.currentTarget).data('link');
    window.open(href, '_blank');
  };
  

  handleFilterChanged = (event: ojButtonsetOne.valueChanged) => {
    const value = event.detail.value;

    if (value === "all") {
      this.dataProvider(this.baseDataProvider);
    } else {
      const filter = {
        op: "$co",
        value: {
          Tags: value,
        },
      };
      this.dataProvider(
        new ListDataProviderView(this.baseDataProvider, {
          filterCriterion: filter as DataFilter.Filter<Data>,
        })
      );
    }
  };

  constructor() {

    this.dataProvider = ko.observable();
    this.baseDataProvider = ko.observable();
    this.baseDataProvider = new ArrayDataProvider(JSON.parse("[]"), {
      keyAttributes: "ID",
    });
    
    this.dataProvider = ko.observable(this.baseDataProvider);
    let self = this;
      Tabletop.init( {
      key: 'https://docs.google.com/spreadsheets/d/1H3MXhBiqV0V-4HCQGymJSKH4O5ODpJPLnjzLouCfqzw/pubhtml',
      simpleSheet: false }
    ).then(function(data, tabletop) { 
      self.baseDataProvider = new ArrayDataProvider(data.Videos.elements, {
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
