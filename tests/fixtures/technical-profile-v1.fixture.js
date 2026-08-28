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
    { id: "diagnostics", label: "Diagnostyka", order: 80 },
    { id: "electrical", label: "Elektryka", order: 90 },
    { id: "wheels", label: "Opony i koła", order: 100 },
    { id: "fuel", label: "Układ paliwowy", order: 110 }
  ],

  documents: {
    "doc.fixture.synthetic-manual": {
      id: "doc.fixture.synthetic-manual",
      type: "oem-service-manual",
      title: "Synthetic Technical Profile Test Manual",
      manufacturer: "Fixture Motor Company",
      publicationId: "FIXTURE-ONLY-001",
      edition: "Test edition",
      revision: "1",
      language: "en",
      years: { from: 2099, to: 2099 },
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
      subsection: "Fixture records",
      pages: ["TEST-1"],
      table: "Fixture table 1",
      figure: null,
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
      applicability: { regions: ["ALL"] },
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
      value: { type: "text", text: "H7" },
      specification: "H7 synthetic fixture bulb",
      voltage: { type: "quantity", amount: 12, unit: "V" },
      power: { type: "quantity", amount: 55, unit: "W" },
      quantity: { type: "quantity", amount: 1, unit: "count" },
      tags: ["żarówka", "mijania", "H7"],
      aliases: ["krótkie światła", "H7"],
      variants: [
        {
          id: "lighting.headlight.low-beam.eu",
          when: { regions: ["EU"] },
          patch: {
            power: { type: "quantity", amount: 55, unit: "W" }
          },
          status: "verified",
          sourceIds: ["cite.fixture.synthetic-manual.general"]
        },
        {
          id: "lighting.headlight.low-beam.usa",
          when: { regions: ["USA"] },
          patch: {
            power: { type: "quantity", amount: 60, unit: "W" }
          },
          status: "verified",
          sourceIds: ["cite.fixture.synthetic-manual.general"]
        },
        {
          id: "lighting.headlight.low-beam.usa-2099",
          when: {
            regions: ["USA"],
            years: { from: 2099, to: 2099 }
          },
          patch: {
            power: { type: "quantity", amount: 65, unit: "W" }
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
      variants: [
        {
          id: "fuses.main.abs",
          when: { abs: true },
          patch: { value: { type: "quantity", amount: 40, unit: "A" } },
          status: "verified",
          sourceIds: ["cite.fixture.synthetic-manual.general"]
        },
        {
          id: "fuses.main.non-abs",
          when: { abs: false },
          patch: { value: { type: "quantity", amount: 30, unit: "A" } },
          status: "verified",
          sourceIds: ["cite.fixture.synthetic-manual.general"]
        }
      ],
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
      variants: [
        {
          id: "torque.engine.spark-plug.my2099",
          when: { years: { from: 2099, to: 2099 } },
          patch: { value: { type: "quantity", amount: 14, unit: "N·m" } },
          status: "verified",
          sourceIds: ["cite.fixture.synthetic-manual.general"]
        }
      ],
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
        partNumber: "15410-FIX-003"
      },
      replacements: [
        {
          manufacturer: "Fixture Filters",
          partNumber: "HF-FIX-204",
          verificationStatus: "unverified"
        }
      ],
      tags: ["filtr oleju", "część"],
      aliases: ["oil filter"],
      variants: [
        {
          id: "consumables.oil-filter.track-package",
          when: { equipment: ["track-package"] },
          patch: { value: { type: "text", text: "FIXTURE-RACE-FILTER" } },
          status: "verified",
          sourceIds: ["cite.fixture.synthetic-manual.general"]
        }
      ],
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
      variants: [
        {
          id: "diagnostics.sensor.synthetic.eu-a",
          when: { regions: ["EU"] },
          patch: { value: { type: "range", min: 2.2, max: 2.6, unit: "kΩ" } },
          status: "conflicting-sources",
          sourceIds: ["cite.fixture.synthetic-manual.general"]
        },
        {
          id: "diagnostics.sensor.synthetic.eu-b",
          when: { regions: ["EU"] },
          patch: { value: { type: "range", min: 2.4, max: 2.8, unit: "kΩ" } },
          status: "conflicting-sources",
          sourceIds: ["cite.fixture.synthetic-manual.general"]
        }
      ],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "torque.engine.oil-drain-bolt",
      type: "torque",
      categoryId: "torques",
      label: "Korek spustowy oleju",
      value: { type: "quantity", amount: 29, unit: "N·m" },
      location: "Synthetic engine oil pan",
      description: "Synthetic tightening torque for search tests only.",
      procedure: {
        summary: "Install a synthetic sealing washer before tightening."
      },
      tags: ["korek oleju", "olej", "moment", "miska olejowa"],
      aliases: ["śruba spustowa oleju", "oil drain bolt"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "electrical.battery.nominal-voltage",
      type: "specification",
      categoryId: "electrical",
      label: "Akumulator",
      value: { type: "quantity", amount: 12, unit: "V" },
      manufacturer: "Fixture Battery Company",
      specification: "FIXTURE-BATTERY 12 Ah",
      location: "Synthetic battery compartment",
      tags: ["akumulator", "bateria", "elektryka", "napięcie"],
      aliases: ["bateria", "battery"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "wheels.rear-tire.specification",
      type: "specification",
      categoryId: "wheels",
      label: "Opona tylna",
      value: { type: "text", text: "FIXTURE 180/55 ZR17" },
      specification: "Synthetic radial tubeless tyre",
      location: "Tylne koło",
      tags: ["opona", "tylne koło", "guma"],
      aliases: ["tylna opona", "rear tyre"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "fuses.pgm-fi",
      type: "fuse",
      categoryId: "fuses",
      label: "Bezpiecznik PGM-FI",
      value: { type: "quantity", amount: 20, unit: "A" },
      circuit: "PGM-FI synthetic injection circuit",
      location: "Synthetic secondary fuse box",
      tags: ["bezpiecznik FI", "PGM-FI", "wtrysk"],
      aliases: ["FI fuse", "PGM-FI fuse"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    },
    {
      id: "fuel.pressure.nominal",
      type: "specification",
      categoryId: "fuel",
      label: "Ciśnienie paliwa",
      value: {
        type: "multi",
        values: [
          { type: "quantity", amount: 250, unit: "kPa" },
          { type: "quantity", amount: 2.5, unit: "bar" }
        ]
      },
      description: "Synthetic equivalent pressure values for search tests.",
      tags: ["paliwo", "ciśnienie", "wtrysk"],
      aliases: ["fuel pressure"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"]
    }
  ]
};

module.exports = technicalProfileV1Fixture;
