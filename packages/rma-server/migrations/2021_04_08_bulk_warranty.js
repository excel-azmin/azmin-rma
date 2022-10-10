function execute() {
  const server_settings = db.server_settings.findOne();

  let date = new Date(
    new Date().toLocaleString('en-US', { timeZone: server_settings.timeZone }),
  ).getFullYear();

  warrantyClaims = db.warranty_claim.find({ set: 'Bulk' }).toArray();

  for (let index = 0; index < warrantyClaims.length; index++) {
    const element = warrantyClaims[index];
    db.warranty_claim.updateOne(
      { uuid: element.uuid },
      { $set: { claim_no: UUID() } },
    );
  }

  for (let i = 0; i < warrantyClaims.length; i++) {
    const element = warrantyClaims[i];
    db.warranty_claim.updateOne(
      {
        uuid: element.uuid,
      },
      {
        $set: {
          claim_no: `BRMA-${date}-${i + 1}`,
        },
      },
    );
  }
}

execute();
