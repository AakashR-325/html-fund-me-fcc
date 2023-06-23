import { ethers } from "./ethers-5.6.esm.min.js"
import {abi} from "./constants.js"
import { contractAddress } from "./constants.js"

const clickButton = document.getElementById("clickButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
  if (typeof window.ethereum !== "undefined"){
    window.ethereum.request({method: "eth_requestAccounts"});
    connectButton.innerHTML = "Connected"
  } else {
    connectButton.innerHTML = "Please install metamask"
  }
}

async function getBalance() {
  if(typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum )
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value.toString()
  console.log(`funding with ${ethAmount} ...`);
  if (typeof window.ethereum !== "undefined"){
      const provider = new ethers.providers.Web3Provider(window.ethereum )
      const signer = provider.getSigner()
      console.log(signer)
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try{
      const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done!")
    } catch(error){
      console.log(error)
    }
  }
}

function listenForTransactionMine(transactionResponse, provider){
  console.log( `Mining ${transactionResponse.hash}`)

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`confirmed with ${transactionReceipt.confirmations} confirmations`)
      resolve()
      })
    })
  }

async function withdraw() {
  if (typeof window.ethereum !== "undefined"){
    console.log("Withdrawing ...")
    const provider = new ethers.providers.Web3Provider(window.ethereum )
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try{
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Withdrawing done!")
    }catch(error){
      console.log(error)
    }
  }
}