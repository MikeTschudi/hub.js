import { IConfigurationSchema, IUiSchema, UiSchemaRuleEffects } from "./types";
import { PROJECT_STATUSES } from "../types";

export const HubProjectSchema: IConfigurationSchema = {
  required: ["name"],
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 250,
    },
    summary: {
      type: "string",
    },
    description: {
      type: "string",
    },
    status: {
      type: "string",
      default: PROJECT_STATUSES.notStarted,
      enum: Object.keys(PROJECT_STATUSES),
    },
    extent: {
      type: "object",
    },
    timeline: {
      type: "object",
    },
    view: {
      type: "object",
      properties: {
        showMap: {
          type: "boolean",
        },
        featuredImage: {
          type: "object",
        },
        relatedItemIds: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
  },
} as unknown as IConfigurationSchema;

/**
 * Minimal UI Schema for Hub Project
 */
export const HubProjectCreateUiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      options: { section: "stepper", scale: "l" },
      elements: [
        {
          type: "Step",
          labelKey: "{{i18nScope}}.describeProject.label",
          elements: [
            {
              labelKey: "{{i18nScope}}.name.label",
              scope: "/properties/name",
              type: "Control",
            },
            {
              labelKey: "{{i18nScope}}.summary.label",
              scope: "/properties/summary",
              type: "Control",
              options: {
                control: "hub-field-input-input",
                type: "textarea",
                helperText: {
                  labelKey: "{{i18nScope}}.summary.helperText",
                },
              },
            },
            {
              labelKey: "{{i18nScope}}.description.label",
              scope: "/properties/description",
              type: "Control",
              options: {
                control: "hub-field-input-input",
                type: "textarea",
                helperText: {
                  labelKey: "{{i18nScope}}.description.helperText",
                },
              },
            },
          ],
        },
        {
          type: "Step",
          labelKey: "{{i18nScope}}.setLocation.label",
          rule: {
            effect: UiSchemaRuleEffects.DISABLE,
            condition: {
              scope: "/properties/name",
              schema: { const: "" },
            },
          },
          elements: [
            {
              scope: "/properties/extent",
              type: "Control",
              options: {
                control: "hub-field-input-boundary-picker",
              },
            },
          ],
        },
        {
          type: "Step",
          labelKey: "{{i18nScope}}.statusAndTimeline.label",
          rule: {
            effect: UiSchemaRuleEffects.DISABLE,
            condition: {
              scope: "/properties/name",
              schema: { const: "" },
            },
          },
          elements: [
            {
              labelKey: "{{i18nScope}}.status.label",
              scope: "/properties/status",
              type: "Control",
              options: {
                control: "hub-field-input-select",
                enum: {
                  i18nScope: "{{i18nScope}}.status.enum",
                },
              },
            },
            {
              labelKey: "{{i18nScope}}.timeline.label",
              scope: "/properties/timeline",
              type: "Control",
              options: {
                control: "arcgis-hub-timeline-editor",
              },
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Complete UI Schema for Hub Project
 */
export const HubProjectEditUiSchema: IUiSchema = {
  type: "Layout",
  elements: [
    {
      type: "Section",
      labelKey: "{{i18nScope}}.basicInfo.label",
      elements: [
        {
          labelKey: "{{i18nScope}}.name.label",
          scope: "/properties/name",
          type: "Control",
        },
        {
          labelKey: "{{i18nScope}}.summary.label",
          scope: "/properties/summary",
          type: "Control",
          options: {
            control: "hub-field-input-input",
            type: "textarea",
            helperText: {
              labelKey: "{{i18nScope}}.summary.helperText",
            },
          },
        },
        {
          labelKey: "{{i18nScope}}.description.label",
          scope: "/properties/description",
          type: "Control",
          options: {
            control: "hub-field-input-input",
            type: "textarea",
            helperText: {
              labelKey: "{{i18nScope}}.description.helperText",
            },
          },
        },
        {
          labelKey: "{{i18nScope}}.featuredImage.label",
          scope: "/properties/view/properties/featuredImage",
          type: "Control",
          options: {
            control: "hub-field-input-image-picker",
            maxWidth: 727,
            maxHeight: 484,
            aspectRatio: 1.5,
            helperText: {
              labelKey: "{{i18nScope}}.featuredImage.helperText",
            },
          },
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.location.label",
      elements: [
        {
          scope: "/properties/extent",
          type: "Control",
          options: {
            control: "hub-field-input-boundary-picker",
          },
        },
        {
          labelKey: "{{i18nScope}}.showMap.label",
          scope: "/properties/view/properties/showMap",
          type: "Control",
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.status.label",
      elements: [
        {
          scope: "/properties/status",
          type: "Control",
          options: {
            control: "hub-field-input-select",
            enum: {
              i18nScope: "{{i18nScope}}.status.enum",
            },
          },
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.timeline.label",
      elements: [
        {
          scope: "/properties/timeline",
          type: "Control",
          options: {
            control: "arcgis-hub-timeline-editor",
          },
        },
      ],
    },
    {
      type: "Section",
      labelKey: "{{i18nScope}}.relatedItems.label",
      options: {
        helperText: {
          labelKey: "{{i18nScope}}.relatedItems.helperText",
        },
      },
      elements: [
        {
          scope: "/properties/view/properties/relatedItemIds",
          type: "Control",
          options: {
            control: "hub-field-input-gallery-picker",
            targetEntity: "item",
            limit: 4,
          },
        },
      ],
    },
  ],
};
