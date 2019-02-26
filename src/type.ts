export interface DirectionMapJson {
  status?: string;
  routes?: [
    {
      legs?: [
        {
          arrival_time?: {
            text: string;
          };
          departure_time?: {
            text: string;
          };
          distance?: {
            text: string;
          };
          duration?: {
            text: string;
          };
          start_address?: string;
          end_address?: string;

          steps?: [
            {
              start_location?: {
                lat: string;
                lng: string;
              };
              start_location_address?: any;
              distance?: {
                text: string;
              };
              duration?: {
                text: string;
              };
              travel_mode?: string;
              travel_icon?: string;
              transit_details?: {
                departure_time?: {
                  text: string;
                };
                line?: {
                  short_name?: string;
                  vehicle?: {
                    type: string;
                  };
                };
              };
            }
          ];
        }
      ];
    }
  ];
}

export interface LocalAddressJson {
  results: [
    {
      formatted_address: string;
    }
  ];
}

export interface GeolocationByName {
  results: [
    {
      geometry: {
        location: {
          lat: string;
          lng: string;
        };
      };
    }
  ];
}

export interface DirectionLineData {
  origin: any;
  destination: any;
  travelMode: string;
  transitOptions?: {
    departureTime: Date;
    arrivalTime: Date;
    modes: [string]; // BUS, RAIL, SUBWAY, TRAIN, TRAM
    routingPreference: string; // "FEWER_TRANSFERS" or "LESS_WALKING"
  };
}
