import Controller from '../interfaces/controller.interface';
import { checkIdParam } from "../middlewares/deviceIdParam.middleware";
import { Request, Response, NextFunction, Router } from 'express';
import DataService from '../modules/services/data.service';
let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];
class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    public dataService = new DataService;

    constructor() {
        this.initializeRoutes();
    }


    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getAll);
        this.router.get(`${this.path}/:id/latest`, this.getLatestReadingsFromAllDevices);
        this.router.get(`${this.path}/:id/:num`, this.getRange);
        this.router.post(`${this.path}/:id`, this.addData);
        this.router.delete(`${this.path}/all`, this.deleteAll);
        this.router.delete(`${this.path}/:id`, this.deleteId);
    }
    private getAll = async (request: Request, response: Response, next: NextFunction) => {
        response.status(200).json(testArr);
    }
    private getLatestReadingsFromAllDevices = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const max = testArr.reduce((acc, curr) => Math.max(acc, curr), -Infinity);
        response.status(200).json(max);
    };
    private getAllDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.query(id);
        response.status(200).json(allData);
    };

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { air } = request.body;
        const { id } = request.params;

        const data = {
            temperature: air[0].value,
            pressure: air[1].value,
            humidity: air[2].value,
            deviceId: Number(id),
        }

        try {

            await this.dataService.createData(data);
            response.status(200).json(data);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    };

    private get = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        response.status(200).json(testArr[Number(id)]);
    }
    private getRange = async (request: Request, response: Response, next: NextFunction) => {
        const { id, num } = request.params;

        const array = testArr.slice(Number(id),Number(id)+Number(num));
        response.status(200).json(array);
    }

    private deleteAll = async (request: Request, response: Response, next: NextFunction) => {
        testArr = [];
        response.status(200).json(testArr);
    };
    private deleteId = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        testArr[Number(id)] = 0;
        response.status(200).json(testArr[Number(id)]);
    };
}

export default DataController;
