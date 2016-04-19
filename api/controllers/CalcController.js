/**
 * CalcController
 *
 * @description :: Server-side logic for managing calcs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


	get_balance:function(req,res){

		//var body = JSON.parse(req.body);
		var txs = req.body.txs;
		var change = 0;
		var deb = 0;
		var cred = 0;

		for (var i = 0 ; i<txs.length ; i++)
		{
			console.log(txs[i].change)
			change = change + txs[i].change;
			if (txs[i].change>0) cred = cred+txs[i].change
				else deb = deb+txs[i].change
			console.log('balance is '+change)
		}

		return res.json({written_balance:req.body.addresses[0].final_balance, credit:cred, debit:deb, from_changes:change})
	}

	
};

