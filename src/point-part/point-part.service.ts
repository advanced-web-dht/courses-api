import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PointPart } from './point-part.entity';
import { PointPart_checkDto } from './point-part.dto/point-part_check.dto';

@Injectable()
export class PointPartService {
	constructor(
		@InjectModel(PointPart)
		private pointpartModel: typeof PointPart
	) {}
	async addPointPart({ classId, name, ratio }: PointPart_checkDto): Promise<PointPart> {
		const info = {
			classId,
			name,
			ratio
		};
		const newPointPart = await this.pointpartModel.create(info);
		return newPointPart;
	}
	async getPointStructure(classId: string): Promise<PointPart[]> {
		const point_structure = await this.pointpartModel.findAll({
			where: {
				classID: classId
			},
			attributes: ['name', 'ratio', 'id']
		});
		return point_structure;
	}
	async UpdatePointPart({ id, name, ratio }): Promise<PointPart> {
		const line = await this.pointpartModel.findOne({ where: { id: id } });
		line.set({
			name: name,
			ratio: ratio
		});
		await line.save();
		return line;
	}
}
