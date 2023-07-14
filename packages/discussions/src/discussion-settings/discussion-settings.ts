import { request } from "../request";
import {
  ICreateDiscussionSettingParams,
  IDiscussionSetting,
  IFetchDiscussionSettingParams,
  IRemoveDiscussionSettingParams,
  IRemoveDiscussionSettingResponse,
} from "../types";

/**
 * create discussion settings
 *
 * @export
 * @param {ICreateDiscussionSettingParams} options
 * @return {*} {Promise<IDiscussionSetting>}
 */
export function createDiscussionSetting(
  options: ICreateDiscussionSettingParams
): Promise<IDiscussionSetting> {
  options.httpMethod = "POST";
  return request(`/discussion_settings`, options);
}

/**
 * fetch discussion settings
 *
 * @export
 * @param {IFetchDiscussionSettingParams} options
 * @return {*} {Promise<IDiscussionSetting>}
 */
export function fetchDiscussionSetting(
  options: IFetchDiscussionSettingParams
): Promise<IDiscussionSetting> {
  options.httpMethod = "GET";
  return request(`/discussion_settings/${options.id}`, options);
}

/**
 * remove discussion settings
 *
 * @export
 * @param {IRemoveDiscussionSettingParams} options
 * @return {*} {Promise<IRemoveDiscussionSettingResponse>}
 */
export function removeDiscussionSetting(
  options: IRemoveDiscussionSettingParams
): Promise<IRemoveDiscussionSettingResponse> {
  options.httpMethod = "DELETE";
  return request(`/discussion_settings/${options.id}`, options);
}