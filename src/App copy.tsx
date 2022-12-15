import './App.css';

import { Device } from '@capacitor/device';
import { DatecsPrinter as printer } from 'datecs-printer-capacitor';
import get from 'lodash.get';
import { useEffect, useState } from 'react';

function App() {
  const [log, setLog] = useState<string[]>([]);
  const [listAddress, setListAddress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const info = await Device.getInfo();

      if (info.platform !== 'android') {
        handleLog('platform: not android!');
        return;
      }

      handleLog('platform: android!');
      const res = await printer.getBluetoothPairedDevices();
      handleLog(`Paired Devices: ${JSON.stringify(res)}`);
      setListAddress(res.data);

      const res2 = await printer.getConnectionStatus();
      handleLog(`BL status: ${JSON.stringify(res2)}`);

      printer.addListener('bluetoothChange', async (res) => {
        handleLog(`BL status (live): ${JSON.stringify(res)}`);
        const devices = await printer.getBluetoothPairedDevices();
        handleLog(`Paired Devices (live): ${JSON.stringify(devices)}`);
        setListAddress(devices.data);
      });
    };

    init();

    return () => {
      printer.removeAllListeners();
    };
  }, []);

  const handleLog = (newLog: string) => {
    setLog((log) => [...log, newLog]);
    console.info(newLog);
  };

  return (
    <div className="App">
      <div className="body">
        <button
          style={{ margin: '10px' }}
          onClick={() => {
            setLog([]);
          }}
        >
          Clear log
        </button>
        {listAddress &&
          listAddress.map((e, index) => (
            <button
              key={index}
              disabled={loading}
              style={{ margin: '10px' }}
              onClick={async () => {
                setLoading(true);
                const address = get(e, 'address');
                if (address) {
                  const connectRes = await printer.connect({
                    address,
                  });
                  handleLog(JSON.stringify(connectRes));

                  const res = await printer.print({
                    content: `Pin code: ${Math.floor(Math.random() * 100000000)
                      .toString()
                      .substring(0, 6)}{br}{br}{br}{br}{br}`,
                  });
                  handleLog(JSON.stringify(res));
                  setLoading(false);
                }
              }}
            >
              {'Print with ' + get(e, 'name', 'No name ' + index)}
            </button>
          ))}

        {log.map((e, index) => (
          <p key={index} style={{ textAlign: 'left' }}>
            {index + ' : ' + e}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
