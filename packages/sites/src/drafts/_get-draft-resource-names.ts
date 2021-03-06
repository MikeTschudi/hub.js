import { IHubRequestOptions } from "@esri/hub-common";
import { getItemResources } from "@esri/arcgis-rest-portal";
import { DRAFT_RESOURCE_REGEX } from "./_draft-resource-regex";

/**
 * Gets the name of the resource for the current draft.
 * NOTE: There _should_ only be one, but sometimes it gets messed up.
 * @param siteOrPageId
 * @param hubRequestOptions
 * @private
 */
export function _getDraftResourceNames(
  siteOrPageId: string,
  hubRequestOptions: IHubRequestOptions
): Promise<string[]> {
  return getItemResources(siteOrPageId, {
    portal: hubRequestOptions.portal,
    authentication: hubRequestOptions.authentication
  }).then(response => {
    // search through the resources to find the draft
    const draftResourceNames = response.resources
      .map(({ resource: name }: { resource: string }) => name)
      .filter((name: string) => name.search(DRAFT_RESOURCE_REGEX) !== -1);

    return draftResourceNames;
  });
}
