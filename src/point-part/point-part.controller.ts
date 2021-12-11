import { Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { PointPartService } from './point-part.service';
import { FastifyReply } from 'fastify';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/roles.decorator';
import { Role } from '../role/role.enum';
import { PointPart_checkDto } from './point-part.dto/point-part_check.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('pointpart')
export class PointPartController {
	constructor(private readonly pointpartService: PointPartService) {}

	@Post('/add')
	@Roles(Role.owner, Role.teacher)
	async AddPointPart(@Res() res: FastifyReply, @Body() payload: PointPart_checkDto): Promise<void> {
		try {
			const result = await this.pointpartService.addPointPart(payload);
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
	@Roles(Role.owner, Role.teacher)
	async updatePointPart(@Res() res, @Body() req): Promise<void> {
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

	@Put('/order')
	async updateOrder(@Res() res, @Body() req): Promise<void> {
		try {
			await this.pointpartService.UpdateOrder(req.order);
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
