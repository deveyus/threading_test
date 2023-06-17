import { workerData } from "worker_threads";

workerData.responsePort.on("message", onMessage)

function onMessage(data: number): void {
    // console.log(`Worker Ran ${data}`)
    console.log(data)
    data++;
    console.log(data)

    workerData.responsePort.postMessage(data);
}