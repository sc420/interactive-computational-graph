interface PortData {
  id: string;
  // whether the port is connected
  connected: boolean;
  // default value if the port is not connected
  defaultValue: number;
}

export default PortData;
