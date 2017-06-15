//
//  ObjectRegconitionCell.swift
//  AILearningEnglishForKids
//
//  Created by Martin Lee on 5/17/17.
//  Copyright © 2017 Tien Le. All rights reserved.
//

import UIKit

class ObjectRegconitionCell: UICollectionViewCell {
    var imageView: UIImageView = {
        let iv = UIImageView.init()
        iv.backgroundColor = .clear
        return iv
    }()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.initialize()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func initialize() {
        self.backgroundColor = .clear
        self.layer.cornerRadius = 5.0
        self.layer.masksToBounds = true
        
        let blurEffect = UIBlurEffect(style: UIBlurEffectStyle.dark)
        let blurEffectView = UIVisualEffectView(effect: blurEffect)
        self.addSubview(blurEffectView)
        
        self.addSubview(imageView)
        // Setup constraint
        blurEffectView.snp.makeConstraints { (make) in
            make.leading.trailing.top.bottom.equalTo(self)
        }
        imageView.snp.makeConstraints { (make) in
            make.leading.top.equalTo(self).offset(2)
            make.trailing.bottom.equalTo(self).offset(-2)
        }
    }
}
