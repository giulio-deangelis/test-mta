/* eslint-env es6 */

sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "../util/Navigator"
], function (Controller, Navigator) {
  "use strict";
  return Controller.extend("test.test-mta-ui.controller.Products", {

    onInit: function () {},

    onOrdersButtonPress: function (ev) {
      Navigator.navigate(this, ev);
    },

    onProductPress: function (ev) {
      this.getOwnerComponent().getRouter().navTo("ProductDetails", {
        id: ev.getSource().getBindingContext("oDataModel").getPath().substr(1)
      });
    }
  });
});