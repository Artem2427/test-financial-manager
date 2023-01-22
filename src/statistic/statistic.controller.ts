import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { StatisticBodyDto } from './dto/statistic.body.dto';
import { StatisticResponseDto } from './dto/statistic.response.dto';
import { StatisticService } from './statistic.service';

@ApiTags('Statistic flow')
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get statistic' })
  @ApiCreatedResponse({
    description: 'Get statistic',
    type: StatisticResponseDto,
  })
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getStatistic(
    @Body() statisticBodyDto: StatisticBodyDto,
    @User('id') userId: string,
  ): Promise<StatisticResponseDto> {
    return this.statisticService.getStatistic(statisticBodyDto, userId);
  }
}
