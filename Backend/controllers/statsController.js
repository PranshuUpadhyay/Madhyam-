import Donor from '../models/donor.js';
import User from '../models/user.js';
import Donation from '../models/donation.js';
import { Op } from 'sequelize';

export const getSummaryStats = async (req, res) => {
  try {
    // Total donors (unique userIds in Donor table)
    const donorsCount = await Donor.count({
      distinct: true,
      col: 'userId',
      where: { isAvailable: true }
    });

    // Total donations (count from Donation model)
    const donationsCount = await Donation.count();
    // Completed donations
    const completedDonations = await Donation.count({ where: { status: 'completed' } });
    // Active donations
    const activeDonations = await Donation.count({ where: { status: 'active' } });

    // Total unique cities
    const cities = await Donor.findAll({
      attributes: [
        [Donor.sequelize.fn('DISTINCT', Donor.sequelize.col('city')), 'city']
      ],
      where: { isAvailable: true, city: { [Op.ne]: null } }
    });
    const citiesCount = cities.length;

    // Success rate: percent of completed donations out of all donations
    const successRate = donationsCount > 0 ? Math.round((completedDonations / donationsCount) * 100) : 0;

    res.json({
      success: true,
      data: {
        donors: donorsCount,
        donations: donationsCount,
        completedDonations,
        activeDonations,
        cities: citiesCount,
        successRate
      }
    });
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching summary stats',
      error: error.message
    });
  }
}; 