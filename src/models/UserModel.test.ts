import { Application } from "express"
import { IncomingHttpHeaders } from "http"
import { Socket } from "net"
import { dbConfig } from "../../db"
import { JWTRequest } from "../types/JWTRequest"
import { User } from "../types/user/User"
import { changePassword, getUsers, login } from "./UserModel"

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
    baseResp: jest.fn(),
    badRequestResp: jest.fn()
}))

describe("UserModel", () => {
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
            username: "testUsername",
            password: "testPassword"
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

    it("getUsers()", () => {
        // Mock database connection and query result
        const mockResult: User = {
            username: "testUsername",
            name: "testName",
            role: "testRole"
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
        getUsers(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM user"),
            [],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })

    it("login()", () => {
        // Mock database connection and query result
        const mockResult: User = {
            username: "testUsername",
            name: "testName",
            role: "testRole"
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
        login(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith("SELECT * FROM user WHERE username = ? AND password = ?",
            [mockRequest.body.username, mockRequest.body.password],
            expect.any(Function)
        )

        // Ensure db.end is called
        expect(mockConnection.end).toHaveBeenCalled()
    })

    it("changePassword()", () => {
        // Mock database connection and query result
        const mockResult: User = {
            username: "testUsername",
            name: "testName",
            role: "testRole"
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
        require("mysql2").createConnection.mockReturnValueOnce(mockConnection)

        // Mock database connection for update
        const mockUpdateConnection = {
            query: jest.fn((query, params, callback) => {
                const result = [mockResult]
                if (callback && typeof callback === "function") {
                    callback(null, result)
                }
            }),
            end: jest.fn()
        }

        // Mock mysql2.createConnection to return the mocked update connection
        require("mysql2").createConnection.mockReturnValueOnce(mockUpdateConnection)

        // Call the function with the mocked request and callback
        changePassword(mockRequest, mockCallback)

        // Ensure createConnection is called with the correct config
        expect(require("mysql2").createConnection).toHaveBeenCalledWith(dbConfig)

        // Ensure query is called with the correct SQL and parameters
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM user"),
            [mockRequest.payload?.username, mockRequest.body.oldPassword],
            expect.any(Function)
        )
        expect(mockUpdateConnection.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE user SET"),
            [mockRequest.body.newPassword, mockRequest.payload?.username],
            expect.any(Function)
        )

        // Ensure db.end is called for both connections
        expect(mockConnection.end).toHaveBeenCalled()
        expect(mockUpdateConnection.end).toHaveBeenCalled()
    })
})
