import { codingContractTypesMetadata } from 'core/contracts'
import { CC, Network } from 'state/index'


let cc, network

/** @param {NS} ns **/
export async function main(ns) {

	cc = CC.load()
	network = Network.load()
	
	if (network.contracts.length) {
		for (let i = 0; i < network.contracts.length; i++) {
			const contract = network.contracts[i]
			const answer = findAnswer(contract)

			if (answer != null) {
				const solvingResult = ns.codingcontract.attempt(answer, contract.contract, contract.hostname, { returnReward: true })

				if (solvingResult) {
					network.contracts.splice(i, 1)

					!cc.flags.Silent && ns.toast(`[Contracts] Solved ${contract.contract} on ${contract.hostname}. ${solvingResult}`, 'success', 10 * 1000)
					!cc.flags.Silent && ns.tprint(`[${localeHHMMSS()}] Solved ${contract.contract} on ${contract.hostname}. ${solvingResult}`)
				} else {
					!cc.flags.Silent && ns.toast(`[Contracts] Wrong answer for ${contract.contract} on ${contract.hostname}`, 'error', 10 * 1000)
				}
			} else {
				!cc.flags.Silent && ns.tprint(`[${localeHHMMSS()}] Unable to find the answer for: ${JSON.stringify(contract)}`)
				!cc.flags.Silent && ns.toast(`[Contracts] Unable to find the answer for: ${JSON.stringify(contract)}`, 'warning', 10 * 1000)
			}
		}
	}

	Network.save(network)
}

function findAnswer(contract) {
	let answer

	const codingContractSolution = codingContractTypesMetadata.find((codingContractTypeMetadata) => codingContractTypeMetadata.name === contract.type)

	if (codingContractSolution) {
		answer = codingContractSolution.solver(contract.data)
	} else {
		console.error('Unable to find answer for', contract)
	}

	return answer
}

function localeHHMMSS(ms = 0) {
	if (!ms) {
		ms = new Date().getTime()
	}

	return new Date(ms).toLocaleTimeString()
}

function convert2DArrayToString(arr) {
    const components = []
    arr.forEach((e) => {
        let s = e.toString();
        s = ["[", s, "]"].join("")
        components.push(s)
    });

    return components.join(",").replace(/\s/g, "")
}