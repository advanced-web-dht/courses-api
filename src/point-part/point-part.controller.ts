import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { PointPartService } from './point-part.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../account/account.entity';
import { PointPart } from './point-part.entity';

@Controller('pointpart')
export class PointPartController {
	constructor(private readonly pointpartService: PointPartService) {}

	@Post('/add')
	async AddPointPart(@Res() res: FastifyReply, @Body() req): Promise<void> {
		try {
			const result = await this.pointpartService.addPointPart(req);
			res.status(201).send({ isSuccess: true, PointPart: result });
		} catch (err) {
			if (err.parent.errno === 1062) {
				res.status(409).send({ isSuccess: false });
			} else {
				res.status(500).send({ isSuccess: false });
			}
		}
	}

	@Get('/:classID')
	async GetPointStructure(@Res() res: FastifyReply, @Param('classID') id: string): Promise<void> {
		const result = await this.pointpartService.getPointStructure(id);
		res.status(200).send({ result });
	}

	@Put()
	async updateAccount(@Res() res, @Body() req): Promise<void> {
		try {
			await this.pointpartService.UpdatePointPart(req);
			res.status(201).send({ isSuccess: true });
		} catch (err) {
			if (err.parent.errno === 1062) {
				res.status(409).send({ isSuccess: false });
			} else {
				res.status(500).send({ isSuccess: false });
			}
		}
	}
}
