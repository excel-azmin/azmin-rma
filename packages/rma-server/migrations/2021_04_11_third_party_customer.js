let DEFAULT_CUSTOMER = {
  customer: '{{cur_frm.doc.customer_name}}', // change it to "Castle Craft".
  customer_contact: '', // set if any default contact eg. "1234567890"
  customer_address: '', // set if any default address eg. "testing-address"
};

function execute() {
  let update_query = {
    $set: {},
  };

  Object.keys(DEFAULT_CUSTOMER).forEach(key =>
    DEFAULT_CUSTOMER[key]
      ? (update_query.$set[key] = DEFAULT_CUSTOMER[key])
      : null,
  );

  db.warranty_claim.updateMany(
    {
      claim_type: 'Third Party Warranty',
      customer: {
        $exists: false,
      },
    },
    update_query,
  );
}

execute();
