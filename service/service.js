const axios = require("axios");
require("../db/db");
const apiconfig = require("../config/apis");
const Meli = require("../db/meli");
let MeliData = {};
const serviceGetItem = async (req, res) => {
  let namecategory;
  let currency;
  let seller;

  for (items of req) {
    const response = await axios.get(
      `${apiconfig.apiItems.url}${apiconfig.apiItems.name}?ids=${items.item}`
    );

    for (var i = 0; i < response.data.length; i++) {
      var item = response.data[i];
      if (item.code == 200) {
        currency = await serviceGetcurrency(item.body.currency_id);
        seller = await serviceGetUser(item.body.seller_id);
        namecategory = await serviceGetCategory(item.body.category_id);
        if (typeof item.body.price !== "undefined") {
          MeliData.price = item.body.price;
        } else {
          MeliData.price = 0;
        }

        MeliData.id = items.id;
        MeliData.pais = items.pais;
        MeliData.item = items.item;
        MeliData.start_time = item.body.start_time;
        MeliData.namecategory = namecategory;
        MeliData.currency = currency;
        MeliData.seller = seller;
        const Modelmeli = new Meli(MeliData);
        await Modelmeli.save();
      }
    }
  }
  return;
};

const serviceGetCategory = async (req) => {
  if (typeof req != "undefined") {
    const response = await axios.get(
      `${apiconfig.apiCategory.url}${apiconfig.apiCategory.name}/${req}`
    );
    if (response.status === 200) {
      return response.data.name;
    } else {
      return "n/a";
    }
  } else {
    return "n/a";
  }
};

const serviceGetcurrency = async (req) => {
  if (typeof req != "undefined") {
    const response = await axios.get(
      `${apiconfig.apiCurrency.url}${apiconfig.apiCurrency.name}/${req}`
    );
    if (response.status === 200) {
      return response.data.description;
    } else {
      return "n/a";
    }
  } else {
    return "n/a";
  }
};
const serviceGetUser = async (req) => {
  if (typeof req != "undefined") {
    const response = await axios.get(
      `${apiconfig.apiSellers.url}${apiconfig.apiSellers.name}/${req}`
    );
    if (response.status === 200) {
      return response.data.nickname;
    } else {
      return "n/a";
    }
  } else {
    return "n/a";
  }
};

module.exports = serviceGetItem;
