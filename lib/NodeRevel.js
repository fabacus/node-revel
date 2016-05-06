'use strict'

var request = require('request');
var uuid = require('node-uuid');

class NodeRevel {

  //lets do this thing
  constructor(endpoint, apiKey, apiSecret, enterpriseUserUri) {


    if (!endpoint || !apiKey || !apiSecret || !enterpriseUserUri) {

      throw new Error('You must create a node-revel object with all 4 fields: endpoint, apiKey, apiSecret, enterpriseUserUri');

    }

    if (!this) return new NodeRevel(endpoint, apiKey, apiSecret, enterpriseUserUri);

    this.endpoint = this._prepareEndpoint(endpoint);
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.enterpriseUserUri = enterpriseUserUri;

    this.urls = [
      'resources/Address/',
      'resources/AppliedServiceFee/',
      'resources/AppliedTaxOrder/',
      'resources/AppliedTaxOrderItem/',
      'resources/Appointment/',
      'resources/Attribute/',
      'resources/AttributeValue/',
      'resources/BankDrop/',
      'resources/Board/',
      'enterprise/Brand/',
      'resources/BusinessActionLog/',
      'resources/BusinessDay/',
      'resources/Cardswipe/',
      'resources/CateringDelivery/',
      'resources/ClockInImage/',
      'resources/ComboProductSet/',
      'enterprise/Company/',
      'resources/Currency/',
      'resources/CustomMenu/',
      'resources/Customer/',
      'resources/CustomerAddress/',
      'resources/CustomerGroup/',
      'resources/CustomerGroupCustomers/',
      'resources/CustomerHistory/',
      'resources/CustomerImage/',
      'resources/DeclaredTips/',
      'resources/Deliveries/',
      'resources/DeliveryDriver/',
      'resources/DeliveryMileage/',
      'resources/Department/',
      'resources/Device/',
      'resources/DeviceExtraParameters/',
      'resources/DeviceView/',
      'resources/Discount/',
      'resources/DiscountCode/',
      'resources/DiscountLevel/',
      'resources/DisplayUnit/',
      'resources/DynamicCombo/',
      'resources/DynamicComboUpsellSlot/',
      'resources/Employee/',
      'resources/EmployeeRoleEstablishment/',
      'resources/EnablerFieldNameMapping/',
      'enterprise/Establishment/',
      'resources/EventDate/',
      'resources/EventInfo/',
      'resources/EventInventory/',
      'resources/FiscalReport/',
      'resources/ForecourtData/',
      'resources/GiftCard/',
      'resources/GiftCardLog/',
      'resources/Grades/',
      'resources/HoseLogs/',
      'resources/Hoses/',
      'resources/HouseAccountPayment/',
      'resources/Ingredient/',
      'resources/IngredientInventory/',
      'resources/IngredientPurchase/',
      'resources/Inventory/',
      'resources/InventoryReceipt/',
      'resources/InventoryStockAmount/',
      'resources/InventoryUnit/',
      'resources/KitchenProduct/',
      'resources/KitchenView/',
      'resources/LanguagePackage/',
      'resources/LanguagePackageItem/',
      'resources/LoyaltyTier/',
      'resources/LoyaltyTierRule/',
      'resources/Modifier/',
      'resources/ModifierClass/',
      'resources/ModifierDiscount/',
      'resources/ModifierItem/',
      'resources/ModifierRecipe/',
      'resources/OrderAllInOne/',
      'resources/OrderExchange/',
      'resources/OrderExchangeItem/',
      'resources/OrderHistory/',
      'resources/OrderItem/',
      'resources/OrderItemCatering/',
      'resources/OrderItemCommission/',
      'resources/OrderRegistryData/',
      'resources/OrderTaxBreakDown/',
      'resources/OriginalProductGroup/',
      'resources/POSMessage/',
      'resources/POSOfferTransaction/',
      'resources/Package/',
      'resources/Payment/',
      'resources/PaymentSignatureImage/',
      'resources/Payout/',
      'resources/Permission/',
      'resources/PortData/',
      'resources/PosStation/',
      'resources/PosTemplate/',
      'resources/Product/',
      'products/ProductCategory/',
      'products/ProductCategorySoldCount/',
      'products/ProductClass/',
      'resources/ProductGroup/',
      'resources/ProductGroupAction/',
      'resources/ProductModifier/',
      'resources/ProductModifierClass/',
      'resources/ProductPurchase/',
      'resources/ProductPurchaseOrderItem/',
      'resources/ProductRecipe/',
      'resources/ProductRevelImage/',
      'resources/ProductSerial/',
      'resources/ProductVariablePrice/',
      'resources/ProtocolType/',
      'resources/PumpProtocolData/',
      'resources/PumpTypeData/',
      'resources/Pumps/',
      'resources/PurchaseOrder/',
      'resources/PurchaseOrderInvoice/',
      'resources/PurchaseOrderItem/',
      'resources/ReceiptText/',
      'resources/Return/',
      'resources/ReturnedItem/',
      'resources/RevelImage/',
      'resources/RevenueCenter/',
      'resources/RewardCardLog/',
      'resources/RewardsCard/',
      'resources/RewardsCardNew/',
      'resources/Role/',
      'resources/ServiceFee/',
      'resources/ShipRate/',
      'resources/SiteModeSettings/',
      'resources/SocialNetwork/',
      'resources/SpecialRequest/',
      'resources/Surcharge/',
      'resources/SystemSetting/',
      'resources/SystemSettingOption/',
      'resources/Table/',
      'resources/TableReservation/',
      'resources/TableSection/',
      'resources/TableTag/',
      'resources/TableType/',
      'resources/Tanks/',
      'resources/Tax/',
      'resources/TaxAgency/',
      'resources/TaxCode/',
      'resources/TaxProductGroup/',
      'resources/TaxRate/',
      'resources/TaxTable/',
      'resources/Till/',
      'resources/TimeBlock/',
      'resources/TimeSchedule/',
      'resources/TimeScheduleRule/',
      'resources/TimeSheetEntry/',
      'resources/Timetable/',
      'resources/TimetableItem/',
      'resources/UnitType/',
      'enterprise/User/',
      'resources/Vendor/',
      'resources/VendorEstablishment/',
      'resources/ViewPurchaseOrder/',
      'resources/ViewPurchaseOrderProduct/',
      'resources/ViewTax/',
      'resources/VisitorTracking/'
    ]


    this._buildFunctions();

  }


  _buildFunctions() {

    var functionName;
    this.urls.forEach((url) => {
      functionName = url.split('/')[1];

      this['get' + functionName] = function(id) {

        if (id) {
          id = this._prepareUri(id);
        } else {
          var id = "";
        }

        const resourceUrl = url + id;
        return this._getObject(resourceUrl);

      }


      this['update' + functionName] = function(updateObject, id) {

        if (!id) {
          throw new Error('missing id for update');
        }

        id = this._prepareUri(id);

        const resourceUrl = url + id;
        return this._updateObject(updateObject, resourceUrl);
      }

      this['insert' + functionName] = function(insertObject, id) {

        if (!insertObject) {
          throw new Error('missing orderObject');

        }

        const resourceUrl = url;
        return this._insertObject(insertObject, resourceUrl);
      }

      this['getAll' + functionName + 's'] = function(parameters) {

        parameters = parameters || {};
        parameters.format = parameters.format || 'json';
        parameters.limit = parameters.limit || 0;

        const resourceUrl = url;
        return this._getObject(resourceUrl, parameters);
      }

    })

  }



  insertCustomer(customerObject) {

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var addresses = [];

    if (customerObject.addresses) {
      customerObject.addresses.forEach((address) => {

        addresses.push({
          "active": address.active || true,
          "address_type": address.address_type || null,
          "city": address.city || "",
          "company_name": address.company_name || "",
          "country": address.country || "",
          "created_date": localISOTime,
          "email": address.email || "",
          "name": address.name || "",
          "phone_number": address.phone_number || "",
          "primary_billing": address.primary_billing || false,
          "primary_shipping": address.primary_shipping || false,
          "state": address.state || "",
          "street_1": address.street_1 || "",
          "street_2": address.street_2 || "",
          "updated_date": localISOTime,
          "zipcode": address.zipcode || ""
        })

      })
    }


    customerObject.active = customerObject.active || true
    customerObject.address = customerObject.address || ""
    customerObject.addresses = addresses
    customerObject.birth_date = customerObject.birth_date || null
    customerObject.cc_exp = customerObject.cc_exp || null
    customerObject.cc_first_name = customerObject.cc_first_name || null
    customerObject.cc_last_4_digits = customerObject.cc_last_4_digits || null
    customerObject.cc_last_name = customerObject.cc_last_name || null
    customerObject.cc_number = customerObject.cc_number || ""
    customerObject.city = customerObject.city || ""
    customerObject.company_name = customerObject.company_name || ""
    customerObject.contract_expiration = customerObject.contract_expiration || null
    customerObject.created_date = localISOTime
    customerObject.customer_groups = customerObject.customer_groups || []
    customerObject.deleted = false
    customerObject.email = customerObject.email || ""
    customerObject.exp_date = customerObject.exp_date || null
    customerObject.expensify_account = customerObject.expensify_account || null
    customerObject.first_name = customerObject.first_name || ""
    customerObject.gift_card_numbers = []
    customerObject.created_by = this.enterpriseUserUri
    customerObject.image = customerObject.image || null
    customerObject.is_visitor = customerObject.is_visitor || false
    customerObject.last_name = customerObject.last_name || ""
    customerObject.lic_number = customerObject.lic_number || null
    customerObject.loyalty_number = customerObject.loyalty_number || ""
    customerObject.loyalty_ref_id = customerObject.loyalty_ref_id || ""
    customerObject.notes = customerObject.notes || ""
    customerObject.phone_number = customerObject.phone_number || ""
    customerObject.picture = customerObject.picture || ""
    customerObject.ref_number = customerObject.ref_number || ""
    customerObject.reward_card_numbers = []
    customerObject.source = customerObject.source || 0
    customerObject.state = customerObject.state || ""
    customerObject.total_purchases = customerObject.total_purchases || 0
    customerObject.total_visits = customerObject.total_visits || 0
    customerObject.updated_by = this.enterpriseUserUri
    customerObject.zipcode = customerObject.zipcode || ""


    const resourceUrl = 'resources/Customer/';
    return this._insertObject(customerObject, resourceUrl);

  }

  updateCustomer(customerObject, id) {

    if (!id) {
      throw new Error('missing id for update');
    }

    id = this._prepareUri(id);

    const resourceUrl = 'resources/Customer/' + id;
    customerObject.updated_by = this.enterpriseUserUri;
    return this._updateObject(customerObject, resourceUrl);

  }

  getOrder(id) {

    if (id) {
      id = this._prepareUri(id);
    } else {
      var id = "";
    }

    const resourceUrl = 'resources/Order/' + id;
    return this._getObject(resourceUrl);

  }


  updateOrder(orderObject, id) {

    if (!id) {
      throw new Error('missing id for update');
    }

    id = this._prepareUri(id);

    const resourceUrl = 'resources/Order/' + id;
    orderObject.updated_by = this.enterpriseUserUri;
    return this._updateObject(orderObject, resourceUrl);

  }

  insertOrder(orderObject) {

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    if (!orderObject) {
      throw new Error('missing Order Object: You must pass an order Object with the function e.g. insertOrder(orderObject)');
    }

    if (!orderObject.created_at) {
      throw new Error('missing "created_at" field. this is required as it shows which point of sale station the order was made e.g. "/resources/PosStation/1/"');
    }

    if (!orderObject.establishment) {
      throw new Error('missing "establishment" field. this is required as it shows which establishment the order was made e.g. "/enterprise/Establishment/1/"');
    }

    if (!orderObject.has_items) {
      throw new Error('missing "has_items" field. this is required as it shows if the order has items or not. Must be true or false.');
    }


    orderObject.applied_service_fee = orderObject.applied_service_fee || [];
    orderObject.applied_taxes = orderObject.applied_taxes || [];
    orderObject.asap = orderObject.asap || false;
    orderObject.auto_grat_pct = orderObject.auto_grat_pct || 0;
    orderObject.bill_number = orderObject.bill_number || 0;
    orderObject.bill_parent = orderObject.bill_parent || null;
    orderObject.bills_info = orderObject.bills_info || "";
    orderObject.bills_type = orderObject.bills_type || 0;
    orderObject.closed = orderObject.closed || false;
    orderObject.created_by = this.enterpriseUserUri;
    orderObject.created_date = localISOTime;
    orderObject.crv_taxed = orderObject.crv_taxed || false;
    orderObject.crv_value = orderObject.crv_value || 0;
    orderObject.customer = orderObject.customer || null;
    orderObject.deleted = orderObject.deleted || false;
    orderObject.deleted_discounts = orderObject.deleted_discounts || "";
    orderObject.delivery_clock_in = orderObject.delivery_clock_in || null;
    orderObject.delivery_clock_out = orderObject.delivery_clock_out || null;
    orderObject.delivery_distance = orderObject.delivery_distance || null;
    orderObject.delivery_duration = orderObject.delivery_duration || null;
    orderObject.delivery_employee = orderObject.delivery_employee || null;
    orderObject.dining_option = orderObject.dining_option || 0;
    orderObject.discount = orderObject.discount || null;
    orderObject.discount_amount = orderObject.discount_amount || null;
    orderObject.discount_code = orderObject.discount_code || "";
    orderObject.discount_reason = orderObject.discount_reason || "";
    orderObject.discount_rule_amount = orderObject.discount_rule_amount || null;
    orderObject.discount_rule_type = orderObject.discount_rule_type || null;
    orderObject.discount_tax_amount = orderObject.discount_tax_amount || null;
    orderObject.discount_tax_amount_included = orderObject.discount_tax_amount_included || null;
    orderObject.discount_taxed = orderObject.discount_taxed || null;
    orderObject.discount_total_amount = orderObject.discount_total_amount || "0.000000";
    orderObject.discounted_by = orderObject.discounted_by || null;
    orderObject.exchange_discount = orderObject.exchange_discount || null;
    orderObject.exchanged = orderObject.exchanged || null;
    orderObject.external_sync = orderObject.external_sync || null;
    orderObject.final_total = orderObject.final_total || 0;
    orderObject.gift_reward_data = orderObject.gift_reward_data || "";
    orderObject.gratuity = orderObject.gratuity || 0;
    orderObject.gratuity_type = orderObject.gratuity_type || 0;
    orderObject.has_delivery_info = orderObject.has_delivery_info || false;
    orderObject.has_history = orderObject.has_history || true;
    orderObject.invoice_date = orderObject.invoice_date || null;
    orderObject.is_discounted = orderObject.is_discounted || false;
    orderObject.is_invoice = orderObject.is_invoice || false;
    orderObject.is_readonly = orderObject.is_readonly || false;
    orderObject.is_unpaid = orderObject.is_unpaid || true;
    orderObject.notes = orderObject.notes || "";
    orderObject.notification_email_sent = orderObject.notification_email_sent || false;
    orderObject.notification_text_sent = orderObject.notification_text_sent || false;
    orderObject.number_of_people = orderObject.number_of_people || 0;
    orderObject.orderhistory = orderObject.orderhistory || [];
    orderObject.pickup_time = orderObject.pickup_time || null;
    orderObject.points_added = orderObject.points_added || 0;
    orderObject.points_redeemed = orderObject.points_redeemed || 0;
    orderObject.pos_mode = orderObject.pos_mode || "R";
    orderObject.prevailing_surcharge = orderObject.prevailing_surcharge || 0;
    orderObject.printed = orderObject.printed || true;
    orderObject.registry_data = orderObject.registry_data || null;
    orderObject.remaining_due = orderObject.remaining_due || 0;
    orderObject.sent = orderObject.sent || false;
    orderObject.service_fee_tax = orderObject.service_fee_tax || "0.000000";
    orderObject.service_fee_taxed = orderObject.service_fee_taxed || "0.000000";
    orderObject.service_fee_untaxed = orderObject.service_fee_untaxed || "0.000000";
    orderObject.subtotal = orderObject.subtotal || 0;
    orderObject.surcharge = orderObject.surcharge || 0;
    orderObject.surcharge_excluded = orderObject.surcharge_excluded || 0;
    orderObject.table = orderObject.table || null;
    orderObject.table_owner = orderObject.table_owner || null;
    orderObject.tax = orderObject.tax || 0;
    orderObject.tax_excluded_amount = orderObject.tax_excluded_amount || 0;
    orderObject.tax_rebate = orderObject.tax_rebate || 0;
    orderObject.taxable_surcharge = orderObject.taxable_surcharge || 0;
    orderObject.taxable_surcharge_excluded = orderObject.taxable_surcharge_excluded || 0;
    orderObject.updated_by = this.enterpriseUserUri;
    orderObject.updated_date = localISOTime;
    orderObject.uuid = uuid.v4();
    orderObject.web_order = orderObject.web_order || true;

    const resourceUrl = 'resources/Order/';
    return this._insertObject(orderObject, resourceUrl);

  }

  deleteCustomer(id) {

    if (!id) {
      throw new Error('missing id for update');
    }

    id = this._prepareUri(id);

    const resourceUrl = 'resources/Customer/' + id;

    var customerObject = {};
    customerObject.deleted = true;
    customerObject.updated_by = this.enterpriseUserUri;

    return this._updateObject(customerObject, resourceUrl);

  }

  getCustomer(id) {

    if (id) {
      id = this._prepareUri(id);
    } else {
      var id = "";
    }

    const resourceUrl = 'resources/Customer/' + id;
    return this._getObject(resourceUrl);

  }

  getAllCustomers(parameters) {

    parameters = parameters || {
      format: "json",
      limit: 0
    }

    const resourceUrl = 'resources/Customer/';
    return this._getObject(resourceUrl, parameters);

  }






  /*  
      first check is customer exists with a get request,
      by using the customer based resource_uri
    patch if exists else post. 

    if the customer object has an address array we will check if it exists and upsert in a similar fashion as the customer object
    */


  _insertObject(object, resourceUrl) {

    object.created_by = object.created_by || this.enterpriseUserUri;
    var callUrl = this.endpoint + resourceUrl;

    var args = {
      method: 'POST',
      url: callUrl,
      body: JSON.stringify(object),
      format: 'json',
      headers: {
        'Content-Type': 'application/json',
        "API-AUTHENTICATION": this.apiKey + ":" + this.apiSecret
      },

    }
    return new Promise((resolve, reject) => {
      request(args, function(error, response, body) {

        if (Buffer.isBuffer(body)) {
          reject(
            new Error('something went wrong with the API call \n Request method: POST \n URL: ' + args.url + '\n data: \n ' + body.toString())
          );
        }

        if ((typeof body) == 'string') {
          body = JSON.parse(body);
        }
        resolve(body);

      })

    });

  }


  _getObject(resource_uri, parameters) {

    parameters = parameters || { format: "json" };

    resource_uri = resource_uri || object.resource_uri;

    var callUrl = this.endpoint + resource_uri;

    //callUrl = "https://huntsman.revelup.com/resources/Customer/";

    var args = {

      url: callUrl,
      qs: parameters,
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "API-AUTHENTICATION": this.apiKey + ":" + this.apiSecret,

      }
    };

    return new Promise((resolve, reject) => {
      request(args, function(error, responses, body) {


        if ((typeof body) == 'string') {
          try {
            body = JSON.parse(body);
          } catch (e) {
            return reject(e);
          }
        }

        resolve(body);

      });
    })
  }

  _updateObject(object, resource_uri) {

    object.resource_uri = resource_uri || object.resource_uri;

    var callUrl = this.endpoint + object.resource_uri;

    //callUrl = "https://huntsman.revelup.com/resources/Customer/";

    var args = {
      url: callUrl,
      body: JSON.stringify(object),
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "API-AUTHENTICATION": this.apiKey + ":" + this.apiSecret
      }
    };


    return new Promise((resolve, reject) => {
      request(args, function(error, responses, body) {

        if ((typeof body) == 'string') {
          body = JSON.parse(body);
        }
        resolve(body);

      });
    })
  }

  upsertObject(object, key, resource_uri) {


    object.resource_uri = resource_uri || object.resource_uri;
    key = key || false;
    // use iexact key

  }


  // Upsert customer  exists in our own DB and get a symphony id
  // then check if that customer has a revel_id 
  // if it does then patch the information in the customer object and take the address array
  // take their address array and check if they have a billing and a shipping address update one accordingly

  upsertCustomer(object, key, resource_uri) {

    object.resource_uri = resource_uri || object.resource_uri;
    key = key || false;

  }

  _prepareEndpoint(endpoint) {
    // make sure it has a trailing "/" and begins with https://

    //if (new RegExp(endpoint).test('https://')) {
    if (endpoint.indexOf('https://') >= 0) {

      var lastChar = endpoint.substr(-1); // Selects the last character
      if (lastChar != '/') { // If the last character is not a slash
        endpoint = endpoint + '/'; // Append a slash to it.
      }

      return endpoint;

    } else {
      throw new Error('Endpoint: ' + endpoint + ' must begin with "https://"');
    }

  }

  _prepareUri(uri) {

    //get the int id and add a "/" to it
    uri = parseInt(uri);

    uri = uri + '/';
    return uri;

  }

}

module.exports = NodeRevel;
