/**
 * Metal Casting Project API
 * This API serves the frontend with data from databases and other external services.
 *
 * The version of the OpenAPI document: v1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface TargetSettingModel { 
    id?: number;
    title?: string | null;
    category?: string | null;
    actualOverallTarget?: number;
    overallTarget?: number;
    q1_target?: number;
    q2_target?: number;
    q3_target?: number;
    q4_target?: number;
    q1_actual?: number;
    q2_actual?: number;
    q3_actual?: number;
    q4_actual?: number;
}

