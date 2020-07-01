export const inputrange = {
  /* fill */
  target_fill_level_min: 40,
  target_fill_level_max: 90,
  low_level_threshold_min: 10,
  low_level_threshold_max: 30,
  lid_open_alert_time_min: 1,
  lid_open_alert_time_max: 10,
  max_fill_time_min: 60,
  max_fill_time_max: 300,
  alert_to_stop_delay_time_min: 1,
  alert_to_stop_delay_time_max: 10,
  low_level_alert_threshold_min: 10,
  low_level_alert_threshold_max: 30,
  /* pressure */
  min_pressure_setpoint_limit_psi_min: 0,
  min_pressure_setpoint_limit_psi_max: 95,
  min_pressure_setpoint_limit_bar_min: 0,
  min_pressure_setpoint_limit_bar_max: 6.55,
  min_pressure_setpoint_limit_kpa_min: 0,
  min_pressure_setpoint_limit_kpa_max: 655,

  max_pressure_setpoint_limit_psi_min: 5,
  max_pressure_setpoint_limit_psi_max: 100,
  max_pressure_setpoint_limit_bar_min: 0.34,
  max_pressure_setpoint_limit_bar_max: 6.9,
  max_pressure_setpoint_limit_kpa_min: 34,
  max_pressure_setpoint_limit_kpa_max: 690,

  min_pressure_setpoint_range_psi_min: 10,
  min_pressure_setpoint_range_psi_max: 70,
  min_pressure_setpoint_range_bar_min: 0.69,
  min_pressure_setpoint_range_bar_max: 4.83,
  min_pressure_setpoint_range_kpa_min: 69,
  min_pressure_setpoint_range_kpa_max: 483,

  max_pressure_setpoint_range_psi_min: 20,
  max_pressure_setpoint_range_psi_max: 100,
  max_pressure_setpoint_range_bar_min: 1.38,
  max_pressure_setpoint_range_bar_max: 6.9,
  max_pressure_setpoint_range_kpa_min: 138,
  max_pressure_setpoint_range_kpa_max: 690,

  low_pressure_alert_threshold_psi_min: 10,
  low_pressure_alert_threshold_psi_max: 70,
  low_pressure_alert_threshold_bar_min: 0.69,
  low_pressure_alert_threshold_bar_max: 4.83,
  low_pressure_alert_threshold_kpa_min: 69,
  low_pressure_alert_threshold_kpa_max: 483,

  heigh_pressure_alert_threshold_psi_min: 10,
  heigh_pressure_alert_threshold_psi_max: 70,
  heigh_pressure_alert_threshold_bar_min: 0.69,
  heigh_pressure_alert_threshold_bar_max: 4.83,
  heigh_pressure_alert_threshold_kpa_min: 69,
  heigh_pressure_alert_threshold_kpa_max: 483,

  /* temperature setting */
  time_delay_min: 1,
  time_delay_max: 60,
  smart_melt_time_min: 15,
  smart_melt_time_max: 60,

  auto_standby_time_min: 1,
  auto_standby_time_max: 1440,
  auto_heaters_off_time_min: 1,
  auto_heaters_off_time_max: 1440,
  auto_exit_standby_time_min: 1,
  auto_exit_standby_time_max: 180,
  /* temp C*/
  over_temperature_threshold_c_min: 5,
  over_temperature_threshold_c_max: 61,
  under_temperature_threshold_c_min: 9,
  under_temperature_threshold_c_max: 60,
  temperature_setback_c_min: 5,
  temperature_setback_c_max: 60,
  /* temp F*/
  over_temperature_threshold_f_min: 10,
  over_temperature_threshold_f_max: 110,
  under_temperature_threshold_f_min: 10,
  under_temperature_threshold_f_max: 110,
  temperature_setback_f_min: 10,
  temperature_setback_f_max: 120,

  /* zone temperature */

  /*C*/
  applicator_c_min: 40,
  applicator_c_max: 232,
  applicator_k_min: 100,
  applicator_k_max: 450,

  /* Pressure */

  pressure_setpoint_psi_min: 10,
  pressure_setpoint_psi_max: 100,

  pressure_setpoint_bar_min: 0.69,
  pressure_setpoint_bar_max: 6.9,

  pressure_setpoint_kpa_min: 69,
  pressure_setpoint_kpa_max: 690,

  // For melter values conversion
  pressure_setpoint_melter_calc: 1000,
  pressure_setpoint_hydraulic_calc: 15,

  manual_mode_pressure_alert_difference_bar: 0.34,
  manual_mode_pressure_alert_difference_kpa: 34,
  manual_mode_pressure_alert_difference_psi: 5,

  electronic_mode_pressure_alert_difference_bar: 0.34,
  electronic_mode_pressure_alert_difference_kpa: 34,
  electronic_mode_pressure_alert_difference_psi: 5,
 


  prsrOtpt_usPressureCalPtMin_min_psi:0,
  prsrOtpt_usPressureCalPtMin_max_psi:90,

  prsrOtpt_usPressureCalPtMax_min_psi:10,
  prsrOtpt_usPressureCalPtMax_max_psi:100,

  prsrOtpt_usPressureMax_min_psi:10,
  prsrOtpt_usPressureMax_max_psi:100,
  
  prsrOtpt_usPressureMin_min_psi:0,
  prsrOtpt_usPressureMin_max_psi:90,

  prsrOtpt_usLinespeedCalPtMin_min_ftm:0,
  prsrOtpt_usLinespeedCalPtMin_max_ftm:3933,


  prsrOtpt_usLinespeedCalPtMax_min_ftm:5,
  prsrOtpt_usLinespeedCalPtMax_max_ftm:3938,

//changing ^TO_DO
  prsrOtpt_usLinespeedCalPtMin_min_mm:0,
  prsrOtpt_usLinespeedCalPtMin_max_mm:1198.8,



  prsrOtpt_usLinespeedCalPtMax_min_mm:1.5,
  prsrOtpt_usLinespeedCalPtMax_max_mm:1200.3,


  prsrOtpt_usPressureCalPtMin_min_bar:0.0,
  prsrOtpt_usPressureCalPtMin_max_bar:6.21,

  prsrOtpt_usPressureCalPtMax_min_bar:0.69,
  prsrOtpt_usPressureCalPtMax_max_bar:6.90,

  prsrOtpt_usPressureMax_min_bar:0.69,
  prsrOtpt_usPressureMax_max_bar:6.90,
  
  prsrOtpt_usPressureMin_min_bar:0.00,
  prsrOtpt_usPressureMin_max_bar:6.21,



  prsrOtpt_usPressureCalPtMin_min_kpa:0,
  prsrOtpt_usPressureCalPtMin_max_kpa:621,

  prsrOtpt_usPressureCalPtMax_min_kpa:69,
  prsrOtpt_usPressureCalPtMax_max_kpa:690,

  prsrOtpt_usPressureMax_min_kpa:69,
  prsrOtpt_usPressureMax_max_kpa:690,
  
  prsrOtpt_usPressureMin_min_kpa:0,
  prsrOtpt_usPressureMin_max_kpa:621,

  prsrOtpt_usFulScaleLinespeed_min_mmin:1.5,
  prsrOtpt_usFulScaleLinespeed_max_mmin:300.2,

  prsrOtpt_usFulScaleLinespeed_min_ftmin:4,
  prsrOtpt_usFulScaleLinespeed_max_ftmin:3938,


  diffmmin:1.5,
  diffmft:5,
  diffkpa:34,
  diffbar:0.34,
  diffpsi:5,

};
