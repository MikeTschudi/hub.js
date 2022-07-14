/**
 * Hub Timeline Definition
 */
export interface IHubTimeline {
  schemaVersion: number;
  title: string;
  description: string;
  stages: IHubStage[];
}

/**
 * Hub Timeline Stage
 */
export interface IHubStage {
  /**
   * Stage identifier
   */
  key: number;
  /**
   * Stage Title
   */
  title: string;
  /**
   * Timeframe for the stage
   * i.e. "Late Fall 2022"
   */
  timeframe: string;
  /**
   * Stage Description
   */
  description: string;
  /**
   * Stage Link
   */
  link?: string;
  /**
   * Stage Link Display Text
   */
  linkText?: string;
  /**
   * Stage status
   */
  status: string;
}
