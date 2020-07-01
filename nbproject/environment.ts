// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
   BASE_URI:'http://52.167.114.62:3200/api',
  validate:'emailvalidate',
  userdetails:'userDetails',
  subUser:'subuser',
  savePump:'http://52.167.114.62:3200/api/recipe/pump',
  saveTempSetting: 'http://52.167.114.62:3200/api/recipe/temp',
  network: 'http://52.167.114.62:3200/api/recipe/network',
  accessories:"/recipe/accessmanage",
  heatScheduler:"/recipe/heatschedule",
  sysSecurity:"/recipe/syssecurity",
  recipeList:"/recipelist",
  createRecipe:"/norfile/create",
  importNorFile:"/norfile/upload",
  openRecipe:"/openrecipe",
  renameRecipe:"/renamerecipe",
  exportRecipe:"/exportrecipe",
  updatePressure:"/updatepressure",
  updateTempzone:"/updatetempzone",
  createNewRecipe:"/recipecreate",
  defaultRecipeData:"/defaultrecipeval",
  eventLogEventFilter:"/eventlogs/byeventtypes/",
  eventLogZoneFilter:"/eventlogs/byzones/",
  eventLogAllZones:"/eventlogs/zones",
  eventLogDateFilter:"/eventlogs/bydatelogcounts",
  eventLogAllFilters:"/eventlogs/eventypesandzones"
};

// export const environment = {
//   production: false,
//   BASE_URI:'http://52.167.114.62:3200/api',
//   validate:'emailvalidate',
//   userdetails:'userDetails',
//   subUser:'subuser',
//   savePump:'http://52.167.114.62:3200/api/recipe/pump',
//   saveTempSetting: 'http://52.167.114.62:3200/api/recipe/temp',
//   network: 'http://52.167.114.62:3200/api/recipe/network',
//   accessories:"/recipe/accessmanage",
//   heatScheduler:"/recipe/heatschedule"
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
