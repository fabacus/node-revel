'use strict'

var request = require('request');
var uuid = require('uuid');

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
      'resources/OrderExchange/',
      'resources/OrderExchangeItem/',
      'resources/OrderHistory/',
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

  getOrderItem(id) {

    if (id) {
      id = this._prepareUri(id);
    } else {
      var id = "";
    }

    const resourceUrl = 'resources/OrderItem/' + id;
    return this._getObject(resourceUrl);

  }

  updateOrderItem(orderItem, id) {

    if (!id) {
      throw new Error('missing id for update');
    }

    id = this._prepareUri(id);

    const resourceUrl = 'resources/OrderItem/' + id;
    orderItem.updated_by = this.enterpriseUserUri;
    return this._updateObject(orderItem, resourceUrl);

  }

  insertOrderItem(orderItem) {

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    if (!orderItem.station) {
      throw new Error('missing "station" field. this is required as it shows which station the order item came from (e.g. resources/PosStation/1/)');
    }

    if (!orderItem.order) {
      throw new Error('missing "order" field. this is required as it shows which station the order item came from (e.g. resources/Order/1/)');
    }



    // orderItem.gift_card_number = orderItem.gift_card_number || true
    orderItem.is_cold = orderItem.is_cold || false
      // orderItem.commissions = orderItem.commissions || false
      // orderItem.exchange_discount = orderItem.exchange_discount || true
    orderItem.created_by = this.enterpriseUserUri
    orderItem.service_fee_untaxed = orderItem.service_fee_untaxed || 0
    orderItem.pure_sales = orderItem.pure_sales || 0.0

    orderItem.sent = orderItem.sent || false
      // orderItem.exchanged = orderItem.exchanged || true
    orderItem.updated_by = this.enterpriseUserUri
    orderItem.split_with_seat = orderItem.split_with_seat || 0
      // orderItem.product_name_override = orderItem.product_name_override || true
      // orderItem.discount_amount = orderItem.discount_amount || true
    orderItem.tax_amount = orderItem.tax_amount || 0

    orderItem.split_parts = orderItem.split_parts || 0.0
    orderItem.catering_complete = orderItem.catering_complete || false
      // orderItem.sales_tax_exemption_reason = orderItem.sales_tax_exemption_reason || ''
    orderItem.weight = orderItem.weight || 0
    orderItem.sold_by_weight = orderItem.sold_by_weight || 0
    orderItem.taxed_flag = orderItem.taxed_flag || false
      // orderItem.is_discounted = orderItem.is_discounted || true
    orderItem.course_number = orderItem.course_number || 0
      // orderItem.shared = orderItem.shared || true
    orderItem.discount_code = orderItem.discount_code || true

    // orderItem.deleted = orderItem.deleted || true
    orderItem.tax_rate = orderItem.tax_rate || 0
    orderItem.modifier_cost = orderItem.modifier_cost || 0.0

    orderItem.is_layaway = orderItem.is_layaway || false
    orderItem.created_date = localISOTime
    orderItem.printed = orderItem.printed || false
    orderItem.modifier_amount = orderItem.modifier_amount || 0
      // orderItem.tax_rebate = orderItem.tax_rebate || true
      // orderItem.special_request = orderItem.special_request || true
    orderItem.is_donation = orderItem.is_donation || false
      // orderItem.discount_reason = orderItem.discount_reason || ''
    orderItem.commission_amount = orderItem.commission_amount || 0.0

    orderItem.dining_option = orderItem.dining_option || 0
    orderItem.quantity = orderItem.quantity || 1
    orderItem.temp_sort = orderItem.temp_sort || 0

    orderItem.uuid = uuid.v4();

    // orderItem.station = orderItem.station || false
    //   orderItem.serial_number = orderItem.serial_number || 'None'
    //   orderItem.discount_taxed = orderItem.discount_taxed || true
    // orderItem.applied_taxes = orderItem.applied_taxes || false
    // orderItem.is_gift = orderItem.is_gift || false
    //   orderItem.modifieritems = orderItem.modifieritems || true

    // orderItem.split_type = orderItem.split_type || 0
    //   orderItem.applied_service_fee = orderItem.applied_service_fee || true
    // orderItem.cost = orderItem.cost || 0.0
    //   orderItem.uom = orderItem.uom || true
    // orderItem.tax_included = orderItem.tax_included || false
    // orderItem.wholesale_saving_amount = orderItem.wholesale_saving_amount || 0
    // orderItem.is_coupon = orderItem.is_coupon || false


    // orderItem.initial_price = orderItem.initial_price || true
    // orderItem.on_hold = orderItem.on_hold || false
    //  orderItem.ingredientitems = orderItem.ingredientitems || true
    orderItem.updated_date = localISOTime

    // orderItem.crv_value = orderItem.crv_value || true
    orderItem.price = orderItem.price || 0
      // orderItem.voided_reason = orderItem.voided_reason || ''
      //   orderItem.order_local_id = orderItem.order_local_id || true
      // orderItem.service_fee_tax = orderItem.service_fee_tax || 0
      // orderItem.resource_uri = orderItem.resource_uri || false

    // orderItem.service_fee_taxed = orderItem.service_fee_taxed || 0


    const resourceUrl = 'resources/OrderItem/';
    return this._insertObject(orderItem, resourceUrl);

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
    orderObject.local_id = orderObject.local_id || "";

    const resourceUrl = 'resources/Order/';
    return this._insertObject(orderObject, resourceUrl);

  }

  insertOrderAllInOne(completeOrderObject) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    if (!completeOrderObject) {
      throw new Error('missing Order All In One Object: You must pass an all in one order Object with the function e.g. insertOrderAllInOne(completeOrderObject)');
    }

    if (!completeOrderObject.items) {
      throw new Error('missing "items" field. This is required as it is used to add the items contained in an order. E.g. "items": []');
    }

    if (!completeOrderObject.orderInfo) {
      throw new Error('missing "orderInfo" field. This is required as it contains information about the order. E.g. "orderInfo": []');
    }

    if (!completeOrderObject.payments) {
      throw new Error('missing "payments" field. This is required as it contains payments for the order. E.g. "payments": []');
    }

    if (!completeOrderObject.history) {
      throw new Error('missing "history" field. This is required as it contains the history of the order. E.g. "history": []');
    }

    if (!completeOrderObject.orderInfo.created_at) {
      throw new Error('missing "created_at" field on the order info. This is required as it shows which point of sale station the order was made e.g. "/resources/PosStation/1/"');
    }

    if (!completeOrderObject.orderInfo.establishment) {
      throw new Error('missing "establishment" field on the order info. This is required as it shows which establishment the order was made e.g. "/enterprise/Establishment/1/"');
    }

    completeOrderObject.orderInfo.auto_grat_pct = completeOrderObject.orderInfo.auto_grat_pct || null;
    completeOrderObject.orderInfo.bills_info = completeOrderObject.orderInfo.bills_info || "";
    completeOrderObject.orderInfo.call_name = completeOrderObject.orderInfo.call_name || "";
    completeOrderObject.orderInfo.call_number = completeOrderObject.orderInfo.call_number || null;
    completeOrderObject.orderInfo.closed = completeOrderObject.orderInfo.closed || false;
    completeOrderObject.orderInfo.created_by = this.enterpriseUserUri;
    completeOrderObject.orderInfo.created_date = localISOTime;
    completeOrderObject.orderInfo.crv_value = completeOrderObject.orderInfo.crv_value || 0.0;
    completeOrderObject.orderInfo.customer = completeOrderObject.orderInfo.customer || null;
    completeOrderObject.orderInfo.delivery_clock_in = completeOrderObject.orderInfo.delivery_clock_in || null;
    completeOrderObject.orderInfo.delivery_clock_out = completeOrderObject.orderInfo.delivery_clock_out || null;
    completeOrderObject.orderInfo.delivery_employee = completeOrderObject.orderInfo.delivery_employee || null;
    completeOrderObject.orderInfo.dining_option = completeOrderObject.orderInfo.dining_option || 0;
    completeOrderObject.orderInfo.discount = completeOrderObject.orderInfo.discount || null;
    completeOrderObject.orderInfo.discount_amount = completeOrderObject.orderInfo.discount_amount || null;
    completeOrderObject.orderInfo.discount_reason = completeOrderObject.orderInfo.discount_reason || "";
    completeOrderObject.orderInfo.discount_rule_amount = completeOrderObject.orderInfo.discount_rule_amount || null;
    completeOrderObject.orderInfo.discount_rule_type = completeOrderObject.orderInfo.discount_rule_type || null;
    completeOrderObject.orderInfo.discount_taxed = completeOrderObject.orderInfo.discount_taxed || null;
    completeOrderObject.orderInfo.discount_tax_amount = completeOrderObject.orderInfo.discount_tax_amount || null;
    completeOrderObject.orderInfo.exchange_discount = completeOrderObject.orderInfo.exchange_discount || null;
    completeOrderObject.orderInfo.exchanged = completeOrderObject.orderInfo.exchanged || null;
    completeOrderObject.orderInfo.external_sync = completeOrderObject.orderInfo.external_sync || null;
    completeOrderObject.orderInfo.final_total = completeOrderObject.orderInfo.final_total || 0.0;
    completeOrderObject.orderInfo.gratuity = completeOrderObject.orderInfo.gratuity || 0.0;
    completeOrderObject.orderInfo.gratuity_type = completeOrderObject.orderInfo.gratuity_type || 0;
    completeOrderObject.orderInfo.has_delivery_info = completeOrderObject.orderInfo.has_delivery_info || false;
    completeOrderObject.orderInfo.local_id = completeOrderObject.orderInfo.local_id || "";
    completeOrderObject.orderInfo.number_of_people = completeOrderObject.orderInfo.number_of_people || 0;
    completeOrderObject.orderInfo.points_added = completeOrderObject.orderInfo.points_added || 0;
    completeOrderObject.orderInfo.points_redeemed = completeOrderObject.orderInfo.points_redeemed || 0;
    completeOrderObject.orderInfo.pos_mode = completeOrderObject.orderInfo.pos_mode || "R";
    completeOrderObject.orderInfo.prevailing_surcharge = completeOrderObject.orderInfo.prevailing_surcharge || 0.0;
    completeOrderObject.orderInfo.prevailing_tax = completeOrderObject.orderInfo.prevailing_tax || 0.0;
    completeOrderObject.orderInfo.printed = completeOrderObject.orderInfo.printed || false;
    completeOrderObject.orderInfo.remaining_due = completeOrderObject.orderInfo.remaining_due || 0.0;
    completeOrderObject.orderInfo.rounding_delta = completeOrderObject.orderInfo.rounding_delta || 0.0;
    completeOrderObject.orderInfo.service_charge = completeOrderObject.orderInfo.service_charge || 0.0;
    completeOrderObject.orderInfo.subtotal = completeOrderObject.orderInfo.subtotal || 0.0;
    completeOrderObject.orderInfo.surcharge = completeOrderObject.orderInfo.surcharge || 0.0;
    completeOrderObject.orderInfo.table = completeOrderObject.orderInfo.table || null;
    completeOrderObject.orderInfo.table_owner = completeOrderObject.orderInfo.table_owner || null;
    completeOrderObject.orderInfo.tax = completeOrderObject.orderInfo.tax || 0.0;
    completeOrderObject.orderInfo.tax_country = completeOrderObject.orderInfo.tax_country || "";
    completeOrderObject.orderInfo.tax_rebate = completeOrderObject.orderInfo.tax_rebate || null;
    completeOrderObject.orderInfo.updated_by = this.enterpriseUserUri;
    completeOrderObject.orderInfo.updated_date = localISOTime;
    completeOrderObject.orderInfo.uuid = uuid.v4();
    completeOrderObject.orderInfo.web_order = completeOrderObject.orderInfo.web_order || true;

    completeOrderObject.history.forEach((hist) => {
      if (!hist.order_opened_at) {
        throw new Error('missing "order_opened_at" field on order history. This is required as it shows which point of sale station the order was made e.g. "/resources/PosStation/1/"');
      }

      hist.order_closed_by = hist.order_closed_by || null;
      hist.opened = localISOTime;
      hist.order_opened_by = this.enterpriseUserUri;
      hist.closed = hist.closed || null;
      hist.uuid = uuid.v4();
    });

    completeOrderObject.items.forEach((item) => {
      if (!item.station) {
        throw new Error('missing "station" field on order item. This is required as it shows which point of sale station the order was made e.g. "/resources/PosStation/1/"');
      }

      item.catering_delivery_date = item.catering_delivery_date || null;
      item.combo_used = item.combo_used || null;
      item.combo_uuid = item.combo_uuid || null;
      item.cost = item.cost || 0.0;
      item.course_number = item.course_number || 0;
      item.created_by = this.enterpriseUserUri;
      item.created_date = localISOTime;
      item.crv_value = item.crv_value || null;
      item.cup_qty = item.cup_qty || 0;
      item.cup_weight = item.cup_weight || 0.0;
      item.date_paid = item.date_paid || null;
      item.deleted = item.deleted || false;
      item.dining_option = item.dining_option || 0;
      item.discount = item.discount || null;
      item.discount_amount = item.discount_amount || null;
      item.discount_reason = item.discount_reason || "";
      item.discount_rule_amount = item.discount_rule_amount || null;
      item.discount_rule_type = item.discount_rule_type || null;
      item.discount_taxed = item.discount_taxed || null;
      item.exchange_discount = item.exchange_discount || null;
      item.exchanged = item.exchanged || false;
      item.expedited = item.expedited || null;
      item.initial_price = item.initial_price || 0.0;
      item.is_cold = item.is_cold || false;
      item.on_hold = item.on_hold || false;
      item.order_local_id = completeOrderObject.orderInfo.local_id || "";
      item.price = item.price || 0.0;
      item.printed = item.printed || false;
      item.product = item.product || null;
      item.product_name_override = item.product_name_override || "";
      item.quantity = item.quantity || 1;
      item.seat_number = item.seat_number || null;
      item.shared = item.shared || 0;
      item.special_request = item.special_request || "";
      item.split_type = item.split_type || 0;
      item.split_with_seat = item.split_with_seat || 0;
      item.tax_amount = item.tax_amount || 0.0;
      item.tax_rate = item.tax_rate || 0.0;
      item.tax_rebate = item.tax_rebate || 0.0;
      item.taxed_flag = item.taxed_flag || false;
      item.temp_sort = item.temp_sort || 0;
      item.modifier_amount = item.modifier_amount || 0;
      item.updated_by = this.enterpriseUserUri;
      item.updated_date = localISOTime;
      item.uuid = uuid.v4();
      item.voided_by = item.voided_by || null;
      item.voided_date = item.voided_date || null;
      item.voided_reason = item.voided_reason || "";
      item.weight = item.weight || 0.0;
    });

    completeOrderObject.payments.forEach((payment) => {
      if (!payment.establishment) {
        throw new Error('missing "establishment" field on the order payment. This is required as it shows which establishment the order was made e.g. "/enterprise/Establishment/1/"');
      }

      if (!payment.station) {
        throw new Error('missing "station" field on the order payment. This is required as it shows which point of sale station the order was made e.g. "/resources/PosStation/1/"');
      }

      if (!payment.order) {
        throw new Error('missing "order" field on the order payment. This is required as it shows which order the payment is being made against e.g. "/resources/Order/123/"');
      }

      payment.amount = payment.amount || 0.0;
      payment.amount_authorized = payment.amount_authorized || 0.0;
      payment.bill = payment.bill || 0;
      payment.card_type = payment.card_type || null;
      payment.cc_first_name = payment.cc_first_name || null;
      payment.cc_last_name = payment.cc_last_name || null;
      payment.created_by = this.enterpriseUserUri;
      payment.created_date = localISOTime;
      payment.deleted = payment.deleted || null;
      payment.exchanged = payment.exchanged || null;
      payment.executed = payment.executed || false;
      payment.first_4_cc_digits = payment.first_4_cc_digits || "";
      payment.gratuity = payment.gratuity || 0.0;
      payment.last_4_cc_digits = payment.last_4_cc_digits || "";
      payment.other_payment_type = payment.other_payment_type || null;
      payment.payer_id = payment.payer_id || null;
      payment.payment_date = payment.payment_date || localISOTime;
      payment.payment_type = payment.payment_type || 1;
      payment.processor_accepted = payment.processor_accepted || false;
      payment.processor_response = payment.processor_response || null;
      payment.rounding_delta = payment.rounding_delta || 0.0;
      payment.signature_img_url = payment.signature_img_url || null;
      payment.tip = payment.tip || 0.0;
      payment.transaction_captured = payment.transaction_captured || false;
      payment.transaction_data = payment.transaction_data || "";
      payment.transaction_id = payment.transaction_id || "";
      payment.transaction_status = payment.transaction_status || "";
      payment.updated_by = this.enterpriseUserUri;
      payment.updated_date = localISOTime;
      payment.uuid = uuid.v4();
    });

    const resourceUrl = 'resources/OrderAllInOne/';
    return this._insertObject(completeOrderObject, resourceUrl);

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

  getAllOrderItems(parameters) {

    parameters = parameters || {
      format: "json",
      limit: 0
    }

    const resourceUrl = 'resources/OrderItem/';
    return this._getObject(resourceUrl, parameters);

  }
  getAllOrders(parameters) {

    parameters = parameters || {
      format: "json",
      limit: 0
    }

    const resourceUrl = 'resources/Order/';
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
        if(error) {
          return reject(error);
        }

        if (Buffer.isBuffer(body)) {
          reject(
            new Error('something went wrong with the API call \n Request method: POST \n URL: ' + args.url + '\n data: \n ' + body.toString())
          );
        }

        if ((typeof body) == 'string') {
          try {
            body = JSON.parse(body);
          } catch (e) {
            e.responseCode = responses.statusCode;
            e.body = body;
            return reject(e);
          }
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
        if(error) {
          return reject(error);
        }


        if ((typeof body) == 'string') {
          try {
            body = JSON.parse(body);
          } catch (e) {
            e.responseCode = responses.statusCode;
            e.body = body;
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
        if(error) {
          return reject(error);
        }

        if ((typeof body) == 'string') {
          try {
            body = JSON.parse(body);
          } catch (e) {
            e.responseCode = responses.statusCode;
            e.body = body;
            return reject(e);
          }
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
