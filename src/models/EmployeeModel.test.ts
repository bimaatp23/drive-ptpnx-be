import { Application } from "express"
import { IncomingHttpHeaders } from "http"
import { Socket } from "net"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { Employee } from "../types/employee/Employee"
import { generateUUID } from "../utils/UUID"
import { create, getEmployees, remove, update } from "./EmployeeModel"

// Mocking the required dependencies
jest.mock("mysql2", () => ({
    createConnection: jest.fn()
}))

// Mocking the database configuration
jest.mock("../../db", () => ({
    dbConfig: {
        // Provide your mock database configuration here
    }
}))

// Mocking the external functions
jest.mock("../utils/Response", () => ({
    callback: jest.fn(),
    baseResp: jest.fn()
}))

describe("EmployeeModel", () => {
    // Mocked data for testing
    const mockRequest: JWTRequest = {
        query: {},
        payload: {
            username: "testUser",
            name: "testName",
            role: "testRole"
        },
        params: {
            id: "testId"
        },
        body: {
            name: "testName",
            contact: "testContact",
            uuid: generateUUID()
        },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        acceptsEncodings: jest.fn(),
        acceptsLanguages: jest.fn(),
        range: jest.fn(),
        accepted: [],
        param: jest.fn(),
        is: jest.fn(),
        protocol: "",
        secure: false,
        ip: "",
        ips: [],
        subdomains: [],
        path: "",
        hostname: "",
        host: "",
        fresh: false,
        stale: false,
        xhr: false,
        cookies: undefined,
        method: "",
        route: undefined,
        signedCookies: undefined,
        originalUrl: "",
        url: "",
        baseUrl: "",
        app: jest.fn() as unknown as Application,
        aborted: false,
        httpVersion: "",
        httpVersionMajor: 0,
        httpVersionMinor: 0,
        complete: false,
        connection: new Socket,
        socket: new Socket,
        headers: undefined as unknown as IncomingHttpHeaders,
        headersDistinct: undefined as unknown as NodeJS.Dict<string[]>,
        rawHeaders: [],
        trailers: undefined as unknown as NodeJS.Dict<string>,
        trailersDistinct: undefined as unknown as NodeJS.Dict<string[]>,
        rawTrailers: [],
        setTimeout: jest.fn(),
        destroy: jest.fn(),
        readableAborted: false,
        readable: false,
        readableDidRead: false,
        readableEncoding: null,
        readableEnded: false,
        readableFlowing: null,
        readableHighWaterMark: 0,
        readableLength: 0,
        readableObjectMode: false,
        destroyed: false,
        closed: false,
        errored: null,
        _read: jest.fn(),
        read: jest.fn(),
        setEncoding: jest.fn(),
        pause: jest.fn(),
        resume: jest.fn(),
        isPaused: jest.fn(),
        unpipe: jest.fn(),
        unshift: jest.fn(),
        wrap: jest.fn(),
        push: jest.fn(),
        _destroy: jest.fn(),
        addListener: jest.fn(),
        emit: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        prependListener: jest.fn(),
        prependOnceListener: jest.fn(),
        removeListener: jest.fn(),
        [Symbol.asyncIterator]: jest.fn(),
        [Symbol.asyncDispose]: jest.fn(),
        pipe: jest.fn(),
        compose: jest.fn(),
        off: jest.fn(),
        removeAllListeners: jest.fn(),
        setMaxListeners: jest.fn(),
        getMaxListeners: jest.fn(),
        listeners: jest.fn(),
        rawListeners: jest.fn(),
        listenerCount: jest.fn(),
        eventNames: jest.fn()
    }

    const mockCallback = jest.fn()

    beforeEach(() => {
        // Reset mock functions before each test
        jest.clearAllMocks()
    })

    it("getEmployees()", () => {
        // Mock database connection and query result
        const mockResult: Employee = {
            id: "1",
            name: "testName",
            contact: "testContact"
        }
        const mockConnection = {
            query: jest.fn((query, params, callback) => {
                const result = [mockResult]
                if (callback && typeof callback === "function") {
                    callback(null, result)
                }
            }),
            end: jest.fn()
        }

        // Mock mysql2.createConnection to return the mocked connection
        require("mysql2").createConnection.mockReturnValue(mockConnection)

        // Call the function with the mocked request and callback
        getEmployees(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM employee"),
            [],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })

    it("create()", () => {
        // Mock database connection and query result
        const mockResult: Employee = {
            id: "1",
            name: "testName",
            contact: "testContact"
        }
        const mockConnection = {
            query: jest.fn((query, params, callback) => {
                const result = [mockResult]
                if (callback && typeof callback === "function") {
                    callback(null, result)
                }
            }),
            end: jest.fn()
        }

        // Mock mysql2.createConnection to return the mocked connection
        require("mysql2").createConnection.mockReturnValue(mockConnection)

        // Call the function with the mocked request and callback
        create(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO employee"),
            [mockRequest.body.uuid, mockRequest.body.name, mockRequest.body.contact],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })

    it("update()", () => {
        // Mock database connection and query result
        const mockResult: Employee = {
            id: "1",
            name: "testName",
            contact: "testContact"
        }
        const mockConnection = {
            query: jest.fn((query, params, callback) => {
                const result = [mockResult]
                if (callback && typeof callback === "function") {
                    callback(null, result)
                }
            }),
            end: jest.fn()
        }

        // Mock mysql2.createConnection to return the mocked connection
        require("mysql2").createConnection.mockReturnValue(mockConnection)

        // Call the function with the mocked request and callback
        update(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE employee SET"),
            [mockRequest.body.name, mockRequest.body.contact, mockRequest.params.id],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })

    it("update()", () => {
        // Mock database connection and query result
        const mockResult: Employee = {
            id: "1",
            name: "testName",
            contact: "testContact"
        }
        const mockConnection = {
            query: jest.fn((query, params, callback) => {
                const result = [mockResult]
                if (callback && typeof callback === "function") {
                    callback(null, result)
                }
            }),
            end: jest.fn()
        }

        // Mock mysql2.createConnection to return the mocked connection
        require("mysql2").createConnection.mockReturnValue(mockConnection)

        // Call the function with the mocked request and callback
        remove(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM employee"),
            [mockRequest.params.id],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })
})
