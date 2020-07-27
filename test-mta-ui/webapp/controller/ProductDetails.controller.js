/* eslint-env es6 */

sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("test.test-mta-ui.controller.ProductDetails", {

    onInit: function () {
      this._attachPatternMatched();
    },

    onBack: function () {
      this.getOwnerComponent()
        .getRouter()
        .navTo("Products");
    },

    _attachPatternMatched: function () {
      this.getOwnerComponent()
        .getRouter()
        .getRoute("ProductDetails")
        .attachPatternMatched(this._onPatternMatch, this); // listen to pattern match ("detail/{id}")
    },

    _onPatternMatch: function (ev) {
      this.getView().bindElement({ // bind the single element given the relative path (e.g.: "Products(3)")
        path: "/" + ev.getParameter("arguments").id,
        model: "oDataModel"
      });
    }
  });
});