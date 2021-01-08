import {
  IAggregationResult,
  mergeAggregations
} from "../../../src/util/aggregations/merge-aggregations";

describe("Merge Aggregation Function", () => {
  it("can properly merge several lists of aggregations with a default merge function", () => {
    // Setup
    const aggregationsOne: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            aggValue: 5
          },
          {
            label: "private",
            aggValue: 3
          },
          {
            label: 0,
            aggValue: 2
          }
        ]
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: 1,
            aggValue: 23
          },
          {
            label: "a_category",
            aggValue: 10
          }
        ]
      }
    ];

    const aggregationsTwo: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            aggValue: 17
          },
          {
            label: "shared",
            aggValue: 5
          },
          {
            label: 1,
            aggValue: 4
          }
        ]
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: 1,
            aggValue: 12
          },
          {
            label: "Feature Layer",
            aggValue: 7
          }
        ]
      }
    ];

    const aggregationsThree: IAggregationResult[] = [
      {
        fieldName: "category",
        aggregations: [
          {
            label: "a_category",
            aggValue: 12
          },
          {
            label: 0,
            aggValue: 9
          }
        ]
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: 0,
            aggValue: 6
          },
          {
            label: "Feature Layer",
            aggValue: 2
          }
        ]
      }
    ];

    const expectedMergedAggregations: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "0",
            aggValue: 2
          },
          {
            label: "1",
            aggValue: 4
          },
          {
            label: "public",
            aggValue: 22
          },
          {
            label: "private",
            aggValue: 3
          },
          {
            label: "shared",
            aggValue: 5
          }
        ]
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "0",
            aggValue: 9
          },
          {
            label: "1",
            aggValue: 23
          },
          {
            label: "a_category",
            aggValue: 22
          }
        ]
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: "0",
            aggValue: 6
          },
          {
            label: "1",
            aggValue: 12
          },
          {
            label: "Feature Layer",
            aggValue: 9
          }
        ]
      }
    ];

    // Test
    const actualMergedAggregations: IAggregationResult[] = mergeAggregations([
      aggregationsOne,
      aggregationsTwo,
      aggregationsThree
    ]);

    // Assert
    expect(expectedMergedAggregations).toEqual(actualMergedAggregations);
  });

  it("can properly merge several lists of aggregations with a custom merge function", () => {
    // Setup
    const aggregationsOne: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            aggValue: 5
          },
          {
            label: "private",
            aggValue: 3
          },
          {
            label: 0,
            aggValue: 2
          }
        ]
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: 1,
            aggValue: 23
          },
          {
            label: "a_category",
            aggValue: 10
          }
        ]
      }
    ];

    const aggregationsTwo: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            aggValue: 17
          },
          {
            label: "shared",
            aggValue: 5
          },
          {
            label: 1,
            aggValue: 4
          }
        ]
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: 1,
            aggValue: 12
          },
          {
            label: "Feature Layer",
            aggValue: 7
          }
        ]
      }
    ];

    const aggregationsThree: IAggregationResult[] = [
      {
        fieldName: "category",
        aggregations: [
          {
            label: "a_category",
            aggValue: 12
          },
          {
            label: 0,
            aggValue: 9
          }
        ]
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: 0,
            aggValue: 6
          },
          {
            label: "Feature Layer",
            aggValue: 2
          }
        ]
      }
    ];

    const mergeFunc: any = (one: number, two: number) => Math.max(one, two);

    const expectedMergedAggregations: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "0",
            aggValue: 2
          },
          {
            label: "1",
            aggValue: 4
          },
          {
            label: "public",
            aggValue: 17
          },
          {
            label: "private",
            aggValue: 3
          },
          {
            label: "shared",
            aggValue: 5
          }
        ]
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "0",
            aggValue: 9
          },
          {
            label: "1",
            aggValue: 23
          },
          {
            label: "a_category",
            aggValue: 12
          }
        ]
      },
      {
        fieldName: "type",
        aggregations: [
          {
            label: "0",
            aggValue: 6
          },
          {
            label: "1",
            aggValue: 12
          },
          {
            label: "Feature Layer",
            aggValue: 7
          }
        ]
      }
    ];

    // Test
    const actualMergedAggregations: IAggregationResult[] = mergeAggregations(
      [aggregationsOne, aggregationsTwo, aggregationsThree],
      mergeFunc
    );

    // Assert
    expect(expectedMergedAggregations).toEqual(actualMergedAggregations);
  });

  it("can properly ignore non-existent aggValues", () => {
    // Setup
    const aggregationsOne: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            aggValue: null
          },
          {
            label: "private",
            aggValue: 3
          },
          {
            label: 0,
            aggValue: 2
          }
        ]
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: 1,
            aggValue: 23
          },
          {
            label: "a_category",
            aggValue: 10
          }
        ]
      }
    ];

    const aggregationsTwo: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            aggValue: 17
          },
          {
            label: "shared",
            aggValue: 5
          },
          {
            label: 1,
            aggValue: 4
          }
        ]
      }
    ];

    const aggregationsThree: IAggregationResult[] = [
      {
        fieldName: "category",
        aggregations: [
          {
            label: "a_category",
            aggValue: undefined
          },
          {
            label: 0,
            aggValue: 9
          }
        ]
      }
    ];

    const expectedMergedAggregations: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "0",
            aggValue: 2
          },
          {
            label: "1",
            aggValue: 4
          },
          {
            label: "public",
            aggValue: 17
          },
          {
            label: "private",
            aggValue: 3
          },
          {
            label: "shared",
            aggValue: 5
          }
        ]
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "0",
            aggValue: 9
          },
          {
            label: "1",
            aggValue: 23
          },
          {
            label: "a_category",
            aggValue: 10
          }
        ]
      }
    ];

    // Test
    const actualMergedAggregations: IAggregationResult[] = mergeAggregations([
      aggregationsOne,
      aggregationsTwo,
      aggregationsThree
    ]);

    // Assert
    expect(expectedMergedAggregations).toEqual(actualMergedAggregations);
  });

  it("can properly default falsey or empty aggregations", () => {
    // Setup
    const aggregationsOne: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            aggValue: 5
          },
          {
            label: "private",
            aggValue: 3
          },
          {
            label: 0,
            aggValue: 2
          }
        ]
      },
      {
        fieldName: "category",
        aggregations: []
      },
      {
        fieldName: "type",
        aggregations: undefined
      }
    ];

    const aggregationsTwo: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "public",
            aggValue: undefined
          },
          {
            label: "shared",
            aggValue: 5
          },
          {
            label: 1,
            aggValue: 4
          }
        ]
      },
      {
        fieldName: "type",
        aggregations: null
      }
    ];

    const aggregationsThree: IAggregationResult[] = [
      {
        fieldName: "category",
        aggregations: [
          {
            label: "a_category",
            aggValue: 20
          },
          {
            label: 0,
            aggValue: 9
          }
        ]
      }
    ];

    const expectedMergedAggregations: IAggregationResult[] = [
      {
        fieldName: "access",
        aggregations: [
          {
            label: "0",
            aggValue: 2
          },
          {
            label: "1",
            aggValue: 4
          },
          {
            label: "public",
            aggValue: 5
          },
          {
            label: "private",
            aggValue: 3
          },
          {
            label: "shared",
            aggValue: 5
          }
        ]
      },
      {
        fieldName: "category",
        aggregations: [
          {
            label: "0",
            aggValue: 9
          },
          {
            label: "a_category",
            aggValue: 20
          }
        ]
      },
      {
        fieldName: "type",
        aggregations: []
      }
    ];

    // Test
    const actualMergedAggregations: IAggregationResult[] = mergeAggregations([
      aggregationsOne,
      aggregationsTwo,
      aggregationsThree
    ]);

    // Assert
    expect(expectedMergedAggregations).toEqual(actualMergedAggregations);
  });
});
