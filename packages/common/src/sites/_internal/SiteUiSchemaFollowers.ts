import { IArcGISContext } from "../../ArcGISContext";
import { IUiSchema } from "../../core/schemas/types";
import { IHubSite } from "../../core/types";

/**
 * @private
 * constructs the followers uiSchema for Hub Sites.
 * This defines how the schema properties should
 * be rendered in the site followers > settings
 * experience
 */
export const buildUiSchema = async (
  i18nScope: string,
  entity: IHubSite,
  context: IArcGISContext
): Promise<IUiSchema> => {
  return {
    type: "Layout",
    elements: [
      {
        type: "Section",
        elements: [
          {
            labelKey: `${i18nScope}.fields.followers.groupAccess.label`,
            scope: "/properties/_followers/properties/groupAccess",
            type: "Control",
            options: {
              control: "hub-field-input-tile-select",
              layout: "horizontal",
              helperText: {
                labelKey: `${i18nScope}.fields.followers.groupAccess.helperText`,
              },
              labels: [
                `{{${i18nScope}.fields.followers.groupAccess.private.label:translate}}`,
                `{{${i18nScope}.fields.followers.groupAccess.org.label:translate}}`,
                `{{${i18nScope}.fields.followers.groupAccess.public.label:translate}}`,
              ],
              descriptions: [
                `{{${i18nScope}.fields.followers.groupAccess.private.description:translate}}`,
                `{{${i18nScope}.fields.followers.groupAccess.org.description:translate}}`,
                `{{${i18nScope}.fields.followers.groupAccess.public.description:translate}}`,
              ],
              icons: ["users", "organization", "globe"],
              styles: { "max-width": "45rem" },
            },
          },
          {
            labelKey: `${i18nScope}.fields.followers.showFollowAction.label`,
            scope: "/properties/_followers/properties/showFollowAction",
            type: "Control",
            options: {
              control: "hub-field-input-switch",
              layout: "inline-space-between",
              helperText: {
                labelKey: `${i18nScope}.fields.followers.showFollowAction.helperText`,
              },
            },
          },
        ],
      },
    ],
  };
};