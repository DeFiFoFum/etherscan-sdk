// https://docs.soliditylang.org/en/v0.8.9/abi-spec.html
type VariableType =
    'uint'      |
    'uint256'   |
    'uint128'   |
    'uint64'    |
    'uint32'    |
    'uint16'    |
    'uint8'     |
    'int'       |
    'int256'    |
    'int128'    |
    'int64'     |
    'int32'     |
    'int16'     |
    'int8'      |
    'address'   |
    'bool'      |
    'function'  |
    'bytes'     |
    'bytes32'   |
    'bytes16'   |
    'bytes8'    |
    'bytes7'    |
    'bytes6'    |
    'bytes5'    |
    'bytes4'    |
    'bytes3'    |
    'bytes2'    |
    'bytes1'

interface VariableDeclaration {
    internalType: VariableType | string;
    name: string;
    type: VariableType;
}

interface EventVariableDeclaration extends VariableDeclaration {
    indexed: boolean;
}

export interface ReceiveABIDeclaration {
    stateMutability: 'payable';
    type: 'receive'
}

export interface FallbackABIDeclaration {
    stateMutability: 'nonpayable' | 'payable' | 'pure' | 'view';
    type: 'fallback'
}

export interface ConstructorABIDeclaration extends Omit<FallbackABIDeclaration, 'type'> {
    inputs: VariableDeclaration[];
    type: 'constructor'
}

export interface FunctionABIDeclaration extends Omit<ConstructorABIDeclaration, 'type'> {
    name: string;
    outputs: VariableDeclaration[];
    type: 'function';
}

export interface EventABIDeclaration {
    inputs: EventVariableDeclaration[];
    name: string;
    type: 'event';
    anonymous: boolean;
}

export type ContractABI = Array<ConstructorABIDeclaration | FallbackABIDeclaration | ReceiveABIDeclaration | FunctionABIDeclaration | EventABIDeclaration>;

interface ParsedABI {
    abi: ContractABI;
    constructor: ConstructorABIDeclaration | undefined;
    fallback: FallbackABIDeclaration | undefined;
    receive: ReceiveABIDeclaration | undefined;
    functions: FunctionABIDeclaration[];
    events: EventABIDeclaration[];
}

/**
 * Loop through the ABI and separate out the functions and events
 * 
 * @param abi 
 * @returns 
 */
export function parseABI(abi: ContractABI | string): ParsedABI {
    let parsedABI = abi as ContractABI;
    if(typeof abi == 'string') {
        parsedABI = JSON.parse(abi) as ContractABI;
    }

    const functions = [] as FunctionABIDeclaration[];
    const events = [] as EventABIDeclaration[];
    let constructor;
    let fallback;
    let receive;
    for (const entity of parsedABI) {
      if(entity.type == 'function') {
        functions.push(entity);
      } else if(entity.type == 'event') {
        events.push(entity);
      } else if(entity.type == 'constructor') {
        constructor = entity;
      } else if(entity.type == 'fallback') {
        fallback = entity;
      } else if(entity.type == 'receive') {
        receive = entity;
      }
    }
    return {
        abi: parsedABI,
        constructor,
        fallback,
        receive,
        functions,
        events,
    }
}