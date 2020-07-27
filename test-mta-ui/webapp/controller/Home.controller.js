/* eslint-env es6 */

sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "../util/Navigator",
  "../util/extensions/String"
], function (Controller, JSONModel, Filter, FilterOperator, Navigator) {
  "use strict";
  return Controller.extend("test.test-mta-ui.controller.Home", {

    onInit: function () {},
    
    onAfterRendering: function() {
      this._table = this.getView().byId("table");
      this._tableTitle = this.getView().byId("tableTitle");
      this._model = this.getView().getModel("oDataModel");
      this._top = 100;
      this._skip = 0;
      
      if (!this._model)
        throw Error("oDataModel not found");
        
      this._model.read("/Orders", {
        urlParameters: { "$top": this._top },
        success: function (oData) {
          const model = new JSONModel(oData);
          this.getView().setModel(model, "orders");
          this._updateTitle();
        }.bind(this)
      });
    },

    onProductsButtonPress: function (ev) {
      Navigator.navigate(this, ev);
    },
    
    onPrevButtonPress: function (ev) {
      this._loadPage(ev.getSource(), true);
    },

    onNextButtonPress: function (ev) {
      this._loadPage(ev.getSource());
    },

    onSearch: function (ev) {
      const query = ev.getParameter("query");
      const filter = query ? new Filter({
        filters: [
          new Filter("CustomerID", FilterOperator.Contains, query),
          new Filter("EmployeeID", FilterOperator.EQ, query),
          new Filter("OrderID", FilterOperator.EQ, query)
        ],
        and: false
      }) : [];
      this._table.getBinding("items").filter(filter);
    },

    _loadPage: function (pressedButton, prev) {
      if (prev) {
        const skip = this._skip - this._top;
        if (skip >= 0)
          this._skip = skip;
        else
          return;
      } else {
        this._skip += this._top;
      }
      this._model.read("/Orders", {
        urlParameters: {
          "$top": this._top,
          "$skip": this._skip
        },
        success: function (oData) {
          const model = this.getView().getModel("orders");
          model.setData(oData);
          model.refresh(true);
          this._updateTitle();
          this._scrollTopIfNeeded(pressedButton);
        }.bind(this)
      });
    },

    _updateTitle: function () {
      const title = this.getView().getModel("i18n").getProperty("orderTableTitle");
      const low = this._skip;
      const high = this._skip + this._top;
      this._tableTitle.setText(title + " (" + low + " - " + high + ")");
    },

    _scrollTopIfNeeded: function (pressedButton) {
      if (pressedButton.getId().includes("bottom"))
        this.byId("page").scrollTo(0, 0);
    }
  });
});