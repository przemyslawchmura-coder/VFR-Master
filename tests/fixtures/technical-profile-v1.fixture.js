"use strict";

// Synthetic fixture only. These values do not describe a real motorcycle and
// this file must never be loaded or registered by the production application.
const technicalProfileV1Fixture = {
  fixtureOnly: true,
  schemaVersion: "revlog-technical-profile/v1",

  profile: {
    id: "fixture.synthetic-motorcycle.profile-v1",
    revision: 1,
    status: "draft",
    language: "pl"
  },

  motorcycle: {
    brand: "Fixture Motor Company",
    model: "Synthetic 1000",
    applicability: {
      catalogVariantKeys: ["fixture.synthetic-1000.gen1"],
      years: { from: 2099, to: 2099 }
    }
  },

  categories: [
    { id: "lubrication", label: "Olej i płyny", order: 10 },
    { id: "ignition", label: "Świece i zapłon", order: 20 },
    { id: "lighting", label: "Oświetlenie", order: 30 },
    { id: "fuses", label: "Bezpieczniki", order: 40 },
    { id: "torques", label: "Momenty dokręcania", order: 50 },
    { id: "maintenance", label: "Obsługa okresowa", order: 60 },
    { id: "consumables", label: "Części eksploatacyjne", order: 70 },
    { id: "diagnostics", label: "Diagnostyka", order: 80 }
  ],

  documents: {
    "doc.fixture.synthetic-manual": {
      id: "doc.fixture.synthetic-manual",
      type: "verified-secondary",
      title: "Synthetic Technical Profile Test Manual",
      manufacturer: "Fixture Motor Company",
      publicationId: "FIXTURE-ONLY-001",
      regions: ["ALL"],
      url: null,
      notes: "Fictional document used only by automated tests."
    }
  },

  citations: {
    "cite.fixture.synthetic-manual.general": {
      id: "cite.fixture.synthetic-manual.general",
      documentId: "doc.fixture.synthetic-manual",
      section: "Synthetic test values",
      pages: ["TEST-1"],
      notes: "Fixture citation; not a real technical source."
    }
  },

  entries: [
    {
      id: "lubrication.engine-oil.capacity-with-filter",
      type: "fluid",
      categoryId: "lubrication",
      label: "Testowa ilość oleju z filtrem",
      value: { type: "quantity", amount: 3.5, unit: "L" },
      specification: "FIXTURE-OIL",
      tags: ["olej", "fixture"],
      aliases: ["testowy olej"],
      relatedEntryIds: ["consumables.oil-filter"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "ignition.spark-plug.primary",
      type: "spark-plug",
      categoryId: "ignition",
      label: "Testowa świeca zapłonowa",
      value: { type: "text", text: "FIXTURE-PLUG-1" },
      manufacturer: "Fixture Plugs",
      gap: { type: "range", min: 0.7, max: 0.8, unit: "mm" },
      tags: ["świeca", "zapłon"],
      aliases: ["test plug"],
      relatedEntryIds: ["torque.engine.spark-plug"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "lighting.headlight.low-beam",
      type: "light-source",
      categoryId: "lighting",
      label: "Testowe światło mijania",
      value: { type: "text", text: "FIXTURE-H7" },
      voltage: { type: "quantity", amount: 12, unit: "V" },
      power: { type: "quantity", amount: 55, unit: "W" },
      quantity: { type: "quantity", amount: 1, unit: "count" },
      tags: ["żarówka", "mijania"],
      aliases: ["krótkie światła"],
      variants: [
        {
          id: "lighting.headlight.low-beam.fixture-market",
          when: { regions: ["FIXTURE"] },
          patch: {
            power: { type: "quantity", amount: 60, unit: "W" }
          },
          status: "verified",
          sourceIds: ["cite.fixture.synthetic-manual.general"]
        }
      ],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "fuses.main",
      type: "fuse",
      categoryId: "fuses",
      label: "Testowy bezpiecznik główny",
      value: { type: "quantity", amount: 30, unit: "A" },
      circuit: "Synthetic main circuit",
      location: "Synthetic fuse box",
      tags: ["bezpiecznik", "główny"],
      aliases: ["main fuse"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "torque.engine.spark-plug",
      type: "torque",
      categoryId: "torques",
      label: "Testowy moment świecy",
      value: { type: "quantity", amount: 13, unit: "N·m" },
      location: "Synthetic cylinder head",
      tags: ["moment", "świeca"],
      aliases: ["dokręcanie świecy"],
      relatedEntryIds: ["ignition.spark-plug.primary"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "maintenance.engine-oil.replace",
      type: "maintenance-task",
      categoryId: "maintenance",
      label: "Testowa wymiana oleju",
      value: { type: "text", text: "Replace synthetic engine oil" },
      interval: {
        distance: { amount: 10000, unit: "km" },
        time: { amount: 12, unit: "month" },
        rule: "whichever-comes-first"
      },
      tags: ["serwis", "olej", "interwał"],
      aliases: ["co ile olej"],
      relatedEntryIds: [
        "lubrication.engine-oil.capacity-with-filter",
        "consumables.oil-filter"
      ],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "consumables.oil-filter",
      type: "consumable-part",
      categoryId: "consumables",
      label: "Testowy filtr oleju",
      value: { type: "text", text: "FIXTURE-OIL-FILTER" },
      oem: {
        manufacturer: "Fixture Motor Company",
        partNumber: "FIXTURE-0001"
      },
      replacements: [],
      tags: ["filtr oleju", "część"],
      aliases: ["oil filter"],
      relatedEntryIds: ["lubrication.engine-oil.capacity-with-filter"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "diagnostics.sensor.synthetic.resistance",
      type: "diagnostic-measurement",
      categoryId: "diagnostics",
      label: "Testowa rezystancja czujnika",
      value: { type: "range", min: 2.1, max: 2.5, unit: "kΩ" },
      conditions: {
        temperature: { type: "quantity", amount: 20, unit: "°C" }
      },
      procedure: {
        summary: "Synthetic measurement; never use on a real motorcycle."
      },
      tags: ["diagnostyka", "rezystancja", "czujnik"],
      aliases: ["test sensor"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    }
  ]
};

module.exports = technicalProfileV1Fixture;
