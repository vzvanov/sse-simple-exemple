const http = require('http');
const PORT = process.env.PORT || 3000;

const listeners = new Map();
const crypto = require('crypto');

const sendTimer = () => {

  const difference = newYearDate.getTime() - new Date().getTime();

  if (difference < 0) {
    newYearDate = getNewYearDate();
    sendTimer();
    return;
  }

  const dateStructure = getDateStructure(difference);
  dateStructure.year = year;

  listeners.forEach((res) => {
    res.write(`event: timer\ndata: ${JSON.stringify(dateStructure)}\n\n`);
  })

  setTimeout(sendTimer, 1000);

}

const getNewYearDate = () => {
  return new Date(++year, 11, 31, 23, 59, 59);
}

const getDateStructure = (mss) => {

  const mssPerMinute = 1000 * 60;
  const mssPerHour = mssPerMinute * 60;
  const mssPerDay = mssPerHour * 24;

  const days = parseInt(mss / mssPerDay);
  const hours = parseInt((mss % mssPerDay) / mssPerHour);
  const minutes = parseInt((mss % mssPerHour) / mssPerMinute);
  const seconds = parseInt((mss % mssPerMinute) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds
  }

}

let year = 2021;
let newYearDate = getNewYearDate();

const server = http.createServer((req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  const id = crypto.randomUUID();
  listeners.set(id, res);

  req.on('close', () => {
    res.end();
    listeners.delete(id);
    console.log(`Client ${id} closed the connection.`);
  })

});

server.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

sendTimer();
