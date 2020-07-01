 export const plcIOConfig=[
     {
        id:0,
        name:'Flexible'
     },
     {
        id:1,
        name:'Index'
     },
     {
        id:2,
        name:'Full Map'
     }
]

export const CCLinkBaud=[
   {
      id:0,
      name:'156 kbps'
   },
   {
      id:1,
      name:'625 kbps'
   },
   {
      id:2,
      name:'2.5 Mbps'
   },
   {
      id:3,
      name:'5 Mbps'
   },
   {
      id:4,
      name:'10 Mbps'
   }
]

export const mapWithFormKey={
   PwrLnkNdId:{
      label:'Powerlink Node ID',
      min:1,
      max:239
   },
   ProfinetName:{
      label:'Profinet Station Name',
      min:1,
      max:63
   },
   ProfibusAddr:{
      label:'Profibus Device Address',
      min:0,
      max:125
   },
   CCLinkAddr:{
      label:'CC-Link Station Number',
      min:1,
      max:64
   },
   SercosIIIAddr:{
      label:'SERCOS III',
      min:0,
      max:511
   },
   CCLinkIEFAddr:{
      label:'CC-Link IE Field Station Number',
      min:1,
      max:120
   }
 }
